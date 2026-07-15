const Anthropic = require("@anthropic-ai/sdk");

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

// ─── AI Course Assistant ──────────────────────────────
const courseAssistant = async (req, res) => {
  try {
    const { message, courseTitle, courseCategory, lessonTitle } = req.body;

    if (!message) {
      return res.status(400).json({ message: "Message is required" });
    }

    const systemPrompt = `You are an expert AI learning assistant for StudyRoom, an online learning platform.

You are helping a student with the course: "${courseTitle}" in the category "${courseCategory}".
${lessonTitle ? `The student is currently on lesson: "${lessonTitle}"` : ""}

Your role:
- Answer questions about the course topic clearly and concisely
- Explain concepts in simple terms with examples
- Provide practical tips and real-world applications
- Encourage the student and keep them motivated
- Suggest related topics they should explore
- Keep responses under 200 words unless detailed explanation needed

Always be friendly, supportive and educational.`;

    const response = await client.messages.create({
      model: "claude-sonnet-4-6",
      max_tokens: 1024,
      system: systemPrompt,
      messages: [{ role: "user", content: message }],
    });

    res.status(200).json({
      reply: response.content[0].text,
      usage: response.usage,
    });
  } catch (error) {
    console.error("AI Assistant error:", error);
    res.status(500).json({
      message: "AI service error",
      error: error.message,
    });
  }
};

// ─── AI Course Recommender ────────────────────────────
const courseRecommender = async (req, res) => {
  try {
    const { interests, currentCourses, level } = req.body;

    const systemPrompt = `You are an expert course recommendation AI for StudyRoom learning platform.

Available categories on our platform:
- Web Development
- Mobile Development  
- Data Science
- Machine Learning
- DevOps
- Design
- Business
- Other

Based on the student's interests and current courses, recommend the best learning path.
Always respond in this EXACT JSON format:
{
  "recommendations": [
    {
      "category": "category name",
      "reason": "why this is recommended",
      "courses": ["course 1", "course 2", "course 3"],
      "priority": "high/medium/low"
    }
  ],
  "learningPath": "A personalized 3-step learning path description",
  "motivationalMessage": "A short encouraging message"
}`;

    const userMessage = `
Student Profile:
- Interests: ${interests}
- Current Level: ${level || "Beginner"}
- Currently enrolled in: ${currentCourses?.join(", ") || "No courses yet"}

Please recommend the best courses and learning path for this student.`;

    const response = await client.messages.create({
      model: "claude-sonnet-4-6",
      max_tokens: 1024,
      system: systemPrompt,
      messages: [{ role: "user", content: userMessage }],
    });

    // Parse JSON response
    const text = response.content[0].text;
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    const recommendations = jsonMatch
      ? JSON.parse(jsonMatch[0])
      : { error: "Could not parse recommendations" };

    res.status(200).json(recommendations);
  } catch (error) {
    console.error("AI Recommender error:", error);
    res.status(500).json({
      message: "AI service error",
      error: error.message,
    });
  }
};

// ─── AI Quiz Generator ────────────────────────────────
const quizGenerator = async (req, res) => {
  try {
    const { courseTitle, category, level, lessonTitle } = req.body;

    const systemPrompt = `You are an expert quiz generator AI for StudyRoom learning platform.

Generate educational quiz questions that test understanding, not just memorization.
Always respond in this EXACT JSON format:
{
  "quiz": {
    "title": "Quiz title",
    "description": "Brief quiz description",
    "questions": [
      {
        "id": 1,
        "question": "Question text?",
        "options": ["Option A", "Option B", "Option C", "Option D"],
        "correctAnswer": 0,
        "explanation": "Why this answer is correct"
      }
    ]
  }
}

Rules:
- Generate exactly 5 questions
- Each question has exactly 4 options
- correctAnswer is the index (0,1,2,3) of the correct option
- Make questions progressively harder
- Include practical/real-world questions
- Explanation should be educational`;

    const userMessage = `Generate a quiz for:
Course: ${courseTitle}
Category: ${category}
Level: ${level || "Beginner"}
${lessonTitle ? `Lesson: ${lessonTitle}` : ""}

Create 5 multiple choice questions that test understanding of this topic.`;

    const response = await client.messages.create({
      model: "claude-sonnet-4-6",
      max_tokens: 2048,
      system: systemPrompt,
      messages: [{ role: "user", content: userMessage }],
    });

    const text = response.content[0].text;
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    const quiz = jsonMatch
      ? JSON.parse(jsonMatch[0])
      : { error: "Could not generate quiz" };

    res.status(200).json(quiz);
  } catch (error) {
    console.error("AI Quiz error:", error);
    res.status(500).json({
      message: "AI service error",
      error: error.message,
    });
  }
};

module.exports = {
  courseAssistant,
  courseRecommender,
  quizGenerator,
};