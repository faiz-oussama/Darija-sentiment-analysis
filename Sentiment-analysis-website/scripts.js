function predictSentiment() {
    const text = document.getElementById('text-input').value.trim();
    if (!text) {
        alert('Please enter some text to analyze');
        return;
    }

    $.ajax({
        url: 'http://localhost:5000/predict',
        type: 'POST',
        contentType: 'application/json',
        data: JSON.stringify({ text: text }),
        success: function(data) {
            console.log(data);
            
            var values = [data.positive_probability, data.negative_probability];
            var labels = ['Positive', 'Negative'];
            
            var pieData = [{
                values: values,
                labels: labels,
                type: 'pie',
                marker: {
                    colors: ['#28a745', '#dc3545']
                },
                textinfo: "label+percent",
                textposition: "inside",
                hole: .4
            }];

            var layout = {
                height: 400,
                width: 400,
                title: {
                    text: 'Sentiment Analysis Results',
                    font: { size: 20 }
                },
                showlegend: true,
                legend: {
                    orientation: "h",
                    xanchor: "center",
                    yanchor: "bottom",
                    y: -0.2,
                    x: 0.5
                }
            };

            Plotly.newPlot('myChart', pieData, layout);
        },
        error: function(xhr, status, error) {
            console.error('Error:', error);
            alert('Error analyzing text. Please try again.');
        }
    });
}

function createPieChart() {

}
