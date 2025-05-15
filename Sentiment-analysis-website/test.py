from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
import torch
import numpy as np
from torch.utils.data import TensorDataset, SequentialSampler, DataLoader
from transformers import BertTokenizer, BertModel
import torch.nn as nn
import os

class BertClassifier(nn.Module):
    def __init__(self, freeze_bert=False):
        super(BertClassifier, self).__init__()
        D_in, H, D_out = 768, 50, 2

        # Instantiate BERT model
        self.bert = BertModel.from_pretrained('bert-base-uncased')

        self.classifier = nn.Sequential(
            nn.Linear(D_in, H),
            nn.ReLU(),
            nn.Linear(H, D_out)
        )

        if freeze_bert:
            for param in self.bert.parameters():
                param.requires_grad = False

    def forward(self, input_ids, attention_mask):
        outputs = self.bert(input_ids=input_ids,
                            attention_mask=attention_mask)

        last_hidden_state_cls = outputs[0][:, 0, :]

        logits = self.classifier(last_hidden_state_cls)

        return logits

app = Flask(__name__, static_folder='.')
CORS(app)

@app.route('/')
def serve_index():
    return send_from_directory('.', 'index.html')

@app.route('/<path:filename>')
def serve_static(filename):
    return send_from_directory('.', filename)

tokenizer = BertTokenizer.from_pretrained('bert-base-uncased', do_lower_case=True)
MAX_LEN = 512

def preprocessing_for_bert(data):
    input_ids = []
    attention_masks = []

    for sent in data:
        encoded_sent = tokenizer.encode_plus(
            text=sent,
            add_special_tokens=True,
            max_length=MAX_LEN,
            padding='max_length',
            truncation=True,
            return_attention_mask=True
        )

        input_ids.append(encoded_sent.get('input_ids'))
        attention_masks.append(encoded_sent.get('attention_mask'))

    input_ids = torch.tensor(input_ids)
    attention_masks = torch.tensor(attention_masks)

    return input_ids, attention_masks

device = torch.device('cuda' if torch.cuda.is_available() else 'cpu')
MODEL_PATH = '../darija_sentiment_model.pt'
checkpoint = torch.load(MODEL_PATH, map_location=device)
bert_classifier = BertClassifier()
bert_classifier.load_state_dict(checkpoint['model_state_dict'])
bert_classifier.eval()

def bert_predict(model, test_dataloader, device):
    """Make predictions with the BERT model"""
    model.eval()
    
    all_logits = []
    
    for batch in test_dataloader:
        b_input_ids, b_attn_mask = tuple(t.to(device) for t in batch)
        
        with torch.no_grad():
            logits = model(b_input_ids, b_attn_mask)
        
        all_logits.append(logits)
    
    all_logits = torch.cat(all_logits, dim=0)
    
    probs = torch.nn.functional.softmax(all_logits, dim=1).cpu().numpy()
    
    return probs

@app.route('/predict', methods=['POST'])
def predict():
    text = request.json.get('text', '')
    if not text:
        return jsonify({"error": "No text provided"}), 400
    
    texts = [text]
    
    print('Tokenizing data...')
    test_inputs, test_masks = preprocessing_for_bert(texts)

    test_dataset = TensorDataset(test_inputs, test_masks)
    test_sampler = SequentialSampler(test_dataset)
    test_dataloader = DataLoader(test_dataset, sampler=test_sampler, batch_size=32)

    probs = bert_predict(bert_classifier, test_dataloader, device)

    threshold = 0.5
    preds = np.where(probs[:, 1] > threshold, 1, 0)

    pos_prob = float(probs[0][1]) * 100  # Convert to percentage
    neg_prob = float(probs[0][0]) * 100 

    response = jsonify({
        "positive_probability": pos_prob,
        "negative_probability": neg_prob,
        "prediction": int(preds[0])  # 1 for positive, 0 for negative
    })
    response.headers.add('Access-Control-Allow-Origin', '*')

    return response

if __name__ == "__main__":
    app.run(debug=True, port=5000)