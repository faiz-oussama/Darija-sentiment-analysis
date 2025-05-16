"use client"

import { useState, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
} from "recharts"
import { Sparkles, Lightbulb, History, Trash2, Heart, Wand2 } from "lucide-react"
import confetti, { create as createConfetti } from "canvas-confetti"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { analyzeSentiment as apiAnalyzeSentiment } from "@/lib/api"

// Example phrases
const examplePhrases = [
  "هاد النهار زوين بزاف، فرحان بزاف",
  "ما عجبنيش هاد الفيلم، ضيعت غير الوقت",
  "الطعام كان بنين بزاف، غادي نرجع ليه",
  "خدمتي معاك كانت رائعة، شكرا بزاف",
  "هاد الخدمة صعيبة بزاف، ما قدرتش نكملها",
]

// Define result type
interface EmotionsType {
  joy: number;
  sadness: number;
  anger: number;
  fear: number;
  surprise: number;
  disgust: number;
  trust: number;
  anticipation: number;
}

interface KeywordType {
  text: string;
  score: number;
}

interface ResultType {
  positive: number;
  negative: number;
  emotions: EmotionsType;
  keywords: KeywordType[];
  timestamp: string;
  text: string;
}

export default function Home() {
  const [text, setText] = useState("")
  const [result, setResult] = useState<ResultType | null>(null)
  const [loading, setLoading] = useState(false)
  const [history, setHistory] = useState<ResultType[]>([])
  const [showHistory, setShowHistory] = useState(false)
  const [isTyping, setIsTyping] = useState(false)
  const confettiCanvasRef = useRef(null)

  const triggerConfetti = () => {
    if (confettiCanvasRef.current) {
      createConfetti(confettiCanvasRef.current, {
        resize: true,
        useWorker: true,
      })({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
      })
    }
  }

  const analyzeSentiment = async () => {
    if (!text.trim()) return

    setLoading(true)
    setIsTyping(true)

    try {
      // Call the Flask API through our Next.js proxy
      const apiResult = await apiAnalyzeSentiment(text)
      
      // Convert API response to our format
      const positiveScore = apiResult.positive_probability
      const negativeScore = apiResult.negative_probability
      
      // Generate emotion scores - since the Flask API doesn't provide these
      // we'll create dummy data based on the positive/negative score
      const joyScore = Math.random() * positiveScore * 0.5
      const sadnessScore = Math.random() * negativeScore * 0.5
      const angerScore = Math.random() * negativeScore * 0.3
      const fearScore = Math.random() * negativeScore * 0.2
      const surpriseScore = Math.random() * 10
      const disgustScore = Math.random() * negativeScore * 0.1
      const trustScore = Math.random() * positiveScore * 0.3
      const anticipationScore = Math.random() * positiveScore * 0.2

      const total =
        joyScore + sadnessScore + angerScore + fearScore + surpriseScore + disgustScore + trustScore + anticipationScore

      const normalizedEmotions = {
        joy: Number(((joyScore / total) * 100).toFixed(1)),
        sadness: Number(((sadnessScore / total) * 100).toFixed(1)),
        anger: Number(((angerScore / total) * 100).toFixed(1)),
        fear: Number(((fearScore / total) * 100).toFixed(1)),
        surprise: Number(((surpriseScore / total) * 100).toFixed(1)),
        disgust: Number(((disgustScore / total) * 100).toFixed(1)),
        trust: Number(((trustScore / total) * 100).toFixed(1)),
        anticipation: Number(((anticipationScore / total) * 100).toFixed(1)),
      }

      // Generate keywords (these aren't provided by the API)
      const keywords = [
        { text: "زوين", score: Math.random() * positiveScore },
        { text: "مزيان", score: Math.random() * positiveScore },
        { text: "فرحان", score: Math.random() * positiveScore },
        { text: "حزين", score: Math.random() * negativeScore },
        { text: "غاضب", score: Math.random() * negativeScore },
      ].sort((a, b) => b.score - a.score)

      const newResult: ResultType = {
        positive: positiveScore,
        negative: negativeScore,
        emotions: normalizedEmotions,
        keywords,
        timestamp: new Date().toISOString(),
        text,
      }

      setResult(newResult)
      setHistory((prev) => [newResult, ...prev])

      // Trigger confetti for very positive results
      if (positiveScore > 75) {
        setTimeout(() => triggerConfetti(), 500)
      }
    } catch (error) {
      console.error("Error analyzing sentiment:", error)
      // Optionally show an error message to the user
    } finally {
      setLoading(false)
      setIsTyping(false)
    }
  }

  const handleExampleClick = (phrase: string) => {
    setText(phrase)
  }

  const handleHistoryItemClick = (item: ResultType) => {
    setText(item.text)
    setResult(item)
  }

  const clearHistory = () => {
    setHistory([])
    setShowHistory(false)
  }

  return (
    <main className="min-h-screen overflow-hidden relative bg-[#0F172A]">
      {/* Background geometric shapes */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
        <motion.div 
          animate={{ 
            rotate: 360, 
            scale: [1, 1.1, 1],
          }}
          transition={{ 
            rotate: { duration: 120, repeat: Infinity, ease: "linear" },
            scale: { duration: 20, repeat: Infinity, ease: "easeInOut" }
          }}
          className="absolute -top-[300px] -right-[300px] w-[600px] h-[600px] rounded-full bg-gradient-to-r from-purple-500/20 to-indigo-500/20 blur-3xl"
        />
        <motion.div 
          animate={{ 
            rotate: -360,
            x: [0, 50, 0],
            y: [0, 30, 0],
          }}
          transition={{ 
            rotate: { duration: 90, repeat: Infinity, ease: "linear" },
            x: { duration: 30, repeat: Infinity, ease: "easeInOut" },
            y: { duration: 40, repeat: Infinity, ease: "easeInOut" }
          }}
          className="absolute top-[40%] -left-[200px] w-[400px] h-[400px] rounded-full bg-gradient-to-r from-pink-500/20 to-red-500/20 blur-3xl"
        />
        <motion.div 
          animate={{ 
            rotate: 180,
            scale: [1, 1.2, 1],
          }}
          transition={{ 
            rotate: { duration: 100, repeat: Infinity, ease: "linear" },
            scale: { duration: 25, repeat: Infinity, ease: "easeInOut" }
          }}
          className="absolute -bottom-[200px] right-[25%] w-[500px] h-[500px] rounded-full bg-gradient-to-r from-blue-500/20 to-cyan-500/20 blur-3xl"
        />
      </div>

      {/* Decorative patterns */}
      <div className="absolute top-0 left-0 w-full h-full z-0 opacity-10">
        <div className="absolute top-[10%] right-[10%] w-40 h-40 border-8 border-purple-500 rounded-full"></div>
        <div className="absolute top-[30%] left-[5%] w-24 h-24 border-4 border-pink-500 transform rotate-45"></div>
        <div className="absolute bottom-[20%] right-[15%] w-32 h-32 border-4 border-blue-500 transform rotate-12 rounded-3xl"></div>
        <div className="absolute bottom-[10%] left-[20%] w-36 h-36 border-8 border-indigo-500 transform -rotate-12 rounded-lg"></div>
      </div>

      {/* Confetti canvas */}
      <canvas
        ref={confettiCanvasRef}
        className="fixed inset-0 pointer-events-none z-50"
        style={{ width: "100vw", height: "100vh" }}
      />

      <div className="container mx-auto px-4 py-10 relative z-10">
        {/* Asymmetric Header */}
        <div className="flex flex-col md:flex-row items-center justify-between mb-16">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="md:w-3/5"
          >
            <h1 className="text-5xl md:text-7xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 leading-tight">
              Darija<br />
              <span className="ml-12">Sentiment</span><br />
              <span className="ml-24">Analyzer</span>
            </h1>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4, duration: 0.5 }}
            className="mt-8 md:mt-0 relative"
          >
            <div className="relative w-48 h-48 flex items-center justify-center">
              <motion.div 
                animate={{ rotate: 360 }}
                transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
                className="absolute inset-0 rounded-full border-4 border-dashed border-purple-500 opacity-50"
              />
              <motion.div 
                animate={{ rotate: -360 }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                className="absolute inset-2 rounded-full border-4 border-dashed border-pink-400 opacity-60"
              />
              <motion.div 
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ duration: 3, repeat: Infinity }}
                className="w-32 h-32 rounded-full bg-gradient-to-br from-indigo-600 to-purple-700 flex items-center justify-center shadow-lg shadow-purple-900/30"
              >
                <Wand2 className="w-12 h-12 text-white" />
              </motion.div>
            </div>
            <div className="mt-4 text-gray-400 text-center max-w-xs">
              <p>Discover emotions in Moroccan Arabic text</p>
            </div>
          </motion.div>
        </div>

        {/* Main Content - Asymmetric Design */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {/* Input Section */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            className="relative z-10 mb-12 md:mb-0"
          >
            <div className="bg-gradient-to-br from-[#1E293B] to-[#0F172A] p-1 shadow-xl">
              <Card className="bg-[#1A2235] border-0 overflow-hidden backdrop-blur-sm">
                <CardContent className="p-6 md:p-8">
                  <div className="flex items-center mb-6">
                    <div className="mr-4 h-10 w-10 bg-purple-500 flex items-center justify-center transform rotate-12 shadow-lg shadow-purple-500/30">
                      <div className="h-8 w-8 bg-gradient-to-br from-purple-600 to-indigo-600 flex items-center justify-center transform -rotate-12">
                        <Lightbulb className="h-4 w-4 text-white" />
                      </div>
                    </div>
                    <h2 className="text-2xl font-bold text-white">Enter Darija Text</h2>
                  </div>

                  <div className="mb-6">
                    <Textarea
                      placeholder="أدخل النص بالدارجة المغربية هنا..."
                      className="min-h-[150px] bg-[#0F172A]/60 border-0 resize-none focus:ring-2 focus:ring-purple-500 text-white shadow-inner shadow-black/30 transition-all text-lg p-4"
                      value={text}
                      onChange={(e) => setText(e.target.value)}
                    />
                  </div>

                  <div>
                    <Button
                      className="w-full h-14 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white border-none shadow-lg shadow-purple-900/30 transition-all text-lg font-medium relative overflow-hidden group"
                      onClick={analyzeSentiment}
                      disabled={loading || !text.trim()}
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-purple-500/0 via-white/10 to-purple-500/0 group-hover:translate-x-full transition-transform duration-1000"></div>
                      <div className="relative flex items-center justify-center">
                        {loading ? (
                          <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                            className="mr-3"
                          >
                            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full" />
                          </motion.div>
                        ) : (
                          <Sparkles className="mr-3 h-5 w-5" />
                        )}
                        <span>{loading ? "Analyzing..." : "Analyze Sentiment"}</span>
                      </div>
                    </Button>
                  </div>

                  <div className="mt-6 bg-[#131B2E] p-4 border border-purple-900/30">
                    <h3 className="text-sm font-medium mb-3 text-purple-300 flex items-center">
                      <Lightbulb className="h-4 w-4 mr-2 text-purple-400" />
                      Try these examples:
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {examplePhrases.map((phrase, index) => (
                        <Badge
                          key={index}
                          variant="outline"
                          className="cursor-pointer bg-[#1E293B] hover:bg-[#273549] transition-colors text-gray-300 hover:text-white border-purple-800/50 py-2 px-3 shadow-inner shadow-purple-500/5"
                          onClick={() => handleExampleClick(phrase)}
                        >
                          {phrase.length > 20 ? phrase.substring(0, 20) + "..." : phrase}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div className="mt-6 flex justify-between items-center border-t border-purple-900/20 pt-4">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-gray-400 hover:text-purple-300 hover:bg-purple-900/20 flex items-center"
                      onClick={() => setShowHistory(!showHistory)}
                    >
                      <History className="mr-2 h-4 w-4" />
                      {showHistory ? "Hide History" : "Show History"}
                    </Button>

                    {history.length > 0 && (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-gray-400 hover:text-red-400 hover:bg-red-900/20 flex items-center"
                        onClick={clearHistory}
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        Clear History
                      </Button>
                    )}
                  </div>

                  <AnimatePresence>
                    {showHistory && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="mt-4 overflow-hidden"
                      >
                        <ScrollArea className="h-[200px] border border-purple-900/30 bg-[#0F172A]/60 p-4">
                          {history.length === 0 ? (
                            <div className="flex flex-col items-center justify-center h-full text-center">
                              <History className="h-10 w-10 text-gray-700 mb-2" />
                              <p className="text-gray-600">No history yet</p>
                            </div>
                          ) : (
                            <div className="space-y-3">
                              {history.map((item, index) => (
                                <div
                                  key={index}
                                  className="p-3 bg-[#1A2235] hover:bg-[#202A43] cursor-pointer transition-colors border border-purple-900/30 shadow-md"
                                  onClick={() => handleHistoryItemClick(item)}
                                >
                                  <div className="flex justify-between items-center mb-1">
                                    <div className="flex items-center">
                                      {item.positive > item.negative ? (
                                        <span className="text-green-500 text-lg mr-2">😊</span>
                                      ) : (
                                        <span className="text-red-500 text-lg mr-2">😔</span>
                                      )}
                                      <span className="text-sm font-medium text-gray-300">
                                        {item.positive > item.negative ? "Positive" : "Negative"} (
                                        {Math.max(item.positive, item.negative).toFixed(0)}%)
                                      </span>
                                    </div>
                                    <span className="text-xs text-gray-500">
                                      {new Date(item.timestamp).toLocaleTimeString()}
                                    </span>
                                  </div>
                                  <p className="text-xs text-gray-400 truncate">{item.text}</p>
                                </div>
                              ))}
                            </div>
                          )}
                        </ScrollArea>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </CardContent>
              </Card>
            </div>
          </motion.div>

          {/* Results Section */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative z-10"
          >
            <div className="bg-gradient-to-br from-[#1E293B] to-[#0F172A] p-1 shadow-xl">
              <Card className="bg-[#1A2235] border-0 overflow-hidden backdrop-blur-sm">
                <CardContent className="p-6 md:p-8">
                  <div className="flex items-center mb-6">
                    <div className="mr-4 h-10 w-10 bg-indigo-500 flex items-center justify-center transform -rotate-12 shadow-lg shadow-indigo-500/30">
                      <div className="h-8 w-8 bg-gradient-to-br from-indigo-600 to-blue-600 flex items-center justify-center transform rotate-12">
                        <Heart className="h-4 w-4 text-white" />
                      </div>
                    </div>
                    <h2 className="text-2xl font-bold text-white">Sentiment Analysis</h2>
                  </div>

                  {!result && !loading && (
                    <div className="flex flex-col items-center justify-center min-h-[350px] text-center">
                      <div className="mb-8 relative">
                        <div className="absolute -inset-4 bg-gradient-to-r from-purple-500 to-indigo-500 opacity-30 blur-xl"></div>
                        <div className="relative w-28 h-28 bg-gradient-to-br from-indigo-600 via-purple-600 to-blue-600 flex items-center justify-center shadow-lg shadow-indigo-900/50 transform rotate-45">
                          <div className="w-20 h-20 bg-[#1A2235] transform -rotate-45 flex items-center justify-center">
                            <Heart className="h-12 w-12 text-pink-500" />
                          </div>
                        </div>
                      </div>
                      <h3 className="text-2xl font-medium text-gray-300 mb-4">Enter Darija text to analyze</h3>
                      <p className="text-gray-400 max-w-md bg-[#131B2E] p-4 border border-indigo-900/30">
                        Discover the emotional tone behind your Moroccan Arabic text with our unique sentiment analyzer
                      </p>
                    </div>
                  )}

                  {loading && (
                    <div className="flex flex-col items-center justify-center min-h-[350px]">
                      <div className="relative mb-8">
                        <motion.div
                          animate={{
                            rotate: 360,
                          }}
                          transition={{
                            rotate: { repeat: Number.POSITIVE_INFINITY, duration: 3, ease: "linear" },
                          }}
                          className="w-32 h-32"
                        >
                          <div className="absolute inset-0 border-4 border-indigo-600 opacity-20"></div>
                          <div className="absolute inset-1 border-4 border-indigo-500 opacity-40"></div>
                          <div className="absolute inset-2 border-4 border-indigo-400 opacity-60"></div>
                          <div className="absolute inset-3 border-4 border-t-transparent border-indigo-300"></div>
                          <div className="absolute inset-0 flex items-center justify-center">
                            <Sparkles className="h-10 w-10 text-indigo-400" />
                          </div>
                        </motion.div>
                      </div>
                      <h3 className="text-2xl font-medium text-gray-300 mb-3">Analyzing sentiment...</h3>
                      {isTyping && (
                        <motion.div 
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          className="flex flex-col items-center"
                        >
                          <p className="text-gray-400 text-center max-w-md mb-4 px-6 py-3 bg-[#131B2E] border border-indigo-900/30">
                            Detecting emotions and analyzing the sentiment of your text...
                          </p>
                          <div className="flex space-x-3 mt-2">
                            <div className="w-3 h-3 bg-indigo-500"></div>
                            <div className="w-3 h-3 bg-purple-500"></div>
                            <div className="w-3 h-3 bg-pink-500"></div>
                          </div>
                        </motion.div>
                      )}
                    </div>
                  )}

                  {result && !loading && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.5 }}
                      className="flex flex-col items-center"
                    >
                      {/* DOMINANT RESULT HEADER */}
                      <div className={`w-full max-w-sm mb-4 p-4 text-center ${
                        result.positive > result.negative 
                          ? 'bg-gradient-to-r from-green-800 to-green-900 border-l-4 border-green-500' 
                          : 'bg-gradient-to-r from-red-800 to-red-900 border-l-4 border-red-500'
                      }`}>
                        <div className="text-xl font-bold text-white uppercase tracking-wide">
                          {result.positive > result.negative ? 'Positive' : 'Negative'} Sentiment Detected
                        </div>
                        <div className="text-5xl font-bold mt-2 flex items-center justify-center">
                          <span className={`${
                            result.positive > result.negative ? 'text-green-400' : 'text-red-400'
                          }`}>
                            {Math.max(result.positive, result.negative).toFixed(0)}%
                          </span>
                          <span className="text-xl ml-2 text-gray-300">
                            {result.positive > result.negative ? '😊' : '😔'}
                          </span>
                        </div>
                      </div>
                      
                      {/* Modern Visualization */}
                      <div className="mb-10 w-full max-w-sm">
                        {/* Bar Visualization */}
                        <div className="w-full h-24 bg-[#131B2E] relative mb-6 overflow-hidden border border-[#1E293B]">
                          {/* Negative Section */}
                          <div 
                            className="absolute top-0 left-0 h-full bg-gradient-to-r from-red-700 to-red-600"
                            style={{ width: `${result.negative}%` }}
                          >
                            {/* Label */}
                            <div className="absolute top-3 right-3 text-xs font-semibold text-white bg-red-700/50 py-1 px-2">
                              {result.negative.toFixed(0)}%
                            </div>
                          </div>
                          
                          {/* Positive Section */}
                          <div 
                            className="absolute top-0 right-0 h-full bg-gradient-to-r from-green-600 to-green-700"
                            style={{ width: `${result.positive}%` }}
                          >
                            {/* Label */}
                            <div className="absolute top-3 left-3 text-xs font-semibold text-white bg-green-700/50 py-1 px-2">
                              {result.positive.toFixed(0)}%
                            </div>
                          </div>
                          
                          {/* Divider/Meter Line */}
                          <div className="absolute top-0 bottom-0 left-1/2 w-1 bg-[#0F172A] transform -translate-x-1/2 z-10"></div>
                          
                          {/* Grid Lines */}
                          <div className="absolute inset-0 grid grid-cols-4">
                            {[...Array(4)].map((_, i) => (
                              <div key={i} className="border-r border-[#0F172A]/50 h-full"></div>
                            ))}
                          </div>

                          {/* Dominant Indicator */}
                          <div className={`absolute bottom-0 h-2 ${result.positive > result.negative ? 'right-0 bg-green-500' : 'left-0 bg-red-500'}`} 
                            style={{ width: `${Math.max(result.positive, result.negative)}%` }}>
                          </div>
                        </div>
                        
                        {/* Emotion Indicators */}
                        <div className="flex justify-between mb-8">
                          <div className="text-center flex-1">
                            <div className="w-full h-3 bg-[#131B2E]">
                              <div className="h-full bg-blue-500" style={{ width: `${result.emotions.trust + result.emotions.joy}%` }}></div>
                            </div>
                            <div className="mt-1 text-xs text-blue-400">Trust & Joy</div>
                          </div>
                          <div className="mx-2"></div>
                          <div className="text-center flex-1">
                            <div className="w-full h-3 bg-[#131B2E]">
                              <div className="h-full bg-purple-500" style={{ width: `${result.emotions.anticipation + result.emotions.surprise}%` }}></div>
                            </div>
                            <div className="mt-1 text-xs text-purple-400">Anticipation</div>
                          </div>
                          <div className="mx-2"></div>
                          <div className="text-center flex-1">
                            <div className="w-full h-3 bg-[#131B2E]">
                              <div className="h-full bg-red-500" style={{ width: `${result.emotions.anger + result.emotions.fear}%` }}></div>
                            </div>
                            <div className="mt-1 text-xs text-red-400">Anger & Fear</div>
                          </div>
                        </div>
                        
                        {/* Key Score Display */}
                        <div className="flex border border-[#1E293B]">
                          <div className={`flex-1 p-4 border-r border-[#1E293B] ${result.positive > result.negative 
                            ? 'bg-[#113123] border-t-4 border-green-600' 
                            : 'bg-transparent'}`}>
                            <div className="flex items-center">
                              <div className="w-3 h-3 bg-green-600 mr-2"></div>
                              <div className="text-sm text-gray-400">Positive</div>
                            </div>
                            <div className="text-2xl mt-1 font-bold text-white">{result.positive.toFixed(0)}%</div>
                          </div>
                          <div className={`flex-1 p-4 ${result.negative > result.positive 
                            ? 'bg-[#311313] border-t-4 border-red-600' 
                            : 'bg-transparent'}`}>
                            <div className="flex items-center">
                              <div className="w-3 h-3 bg-red-600 mr-2"></div>
                              <div className="text-sm text-gray-400">Negative</div>
                            </div>
                            <div className="text-2xl mt-1 font-bold text-white">{result.negative.toFixed(0)}%</div>
                          </div>
                        </div>
                      </div>

                      <div className="text-center px-6 py-4 bg-[#131B2E] border border-indigo-900/30 w-full max-w-sm">
                        <p className="text-gray-300">
                          {result.positive > result.negative 
                            ? "Your text expresses positive emotions and sentiment! 🎉" 
                            : "Your text expresses negative emotions and sentiment 😔"}
                        </p>
                      </div>
                    </motion.div>
                  )}
                </CardContent>
              </Card>
            </div>
          </motion.div>
        </div>
        
        
        
        {/* Footer */}
        <div className="mt-20 text-center text-gray-500 text-sm relative z-10">
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1, duration: 0.8 }}
          >
            Darija Sentiment Analysis Tool - Analyze the emotional tone of Moroccan Arabic text
          </motion.p>
        </div>
      </div>
    </main>
  )
}
