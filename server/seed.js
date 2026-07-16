const mongoose = require("mongoose");
const dotenv = require("dotenv");
const Course = require("./models/Course");
const User = require("./models/User");
const bcrypt = require("bcryptjs");

dotenv.config();

// ─── Course Data ──────────────────────────────────────

const courseTemplates = [
  // Web Development
  { category: "Web Development", courses: [
    "Complete HTML & CSS Bootcamp",
    "JavaScript Mastery Course",
    "React.js from Zero to Hero",
    "Next.js Full Stack Development",
    "Vue.js Complete Guide",
    "Angular Complete Course",
    "TypeScript Masterclass",
    "Node.js Backend Development",
    "Express.js REST API Development",
    "MongoDB Complete Guide",
    "MySQL for Web Developers",
    "PostgreSQL Masterclass",
    "GraphQL API Development",
    "Redux Toolkit Masterclass",
    "Tailwind CSS Complete Guide",
    "Bootstrap 5 Masterclass",
    "SASS & SCSS Complete Guide",
    "Web Performance Optimization",
    "Progressive Web Apps (PWA)",
    "Web Accessibility Guide",
    "WebSockets & Real-time Apps",
    "Firebase Complete Guide",
    "Supabase for Web Developers",
    "MERN Stack Complete Bootcamp",
    "MEAN Stack Development",
    "Jamstack Development",
    "WordPress Development",
    "Shopify Development",
    "Web Security Fundamentals",
    "SEO for Web Developers",
  ]},

  // Python Development
  { category: "Web Development", courses: [
    "Python Django Complete Guide",
    "Python Flask Development",
    "FastAPI Complete Course",
    "Python REST API Development",
    "Python Web Scraping",
    "Python Automation Masterclass",
    "Python for Web Developers",
    "Django REST Framework",
    "Python Celery & Redis",
    "Python Testing Masterclass",
  ]},

  // Data Science
  { category: "Data Science", courses: [
    "Python for Data Science",
    "Data Analysis with Pandas",
    "NumPy Complete Guide",
    "Data Visualization with Matplotlib",
    "Seaborn for Data Science",
    "Plotly & Dash Masterclass",
    "Excel for Data Analysis",
    "Power BI Complete Guide",
    "Tableau Masterclass",
    "SQL for Data Science",
    "Statistics for Data Science",
    "Probability & Statistics",
    "Data Cleaning & Preprocessing",
    "Feature Engineering Guide",
    "Exploratory Data Analysis",
    "Data Science with R",
    "R Programming for Beginners",
    "Business Analytics Masterclass",
    "Google Analytics Complete Guide",
    "Data Storytelling Guide",
    "Big Data Fundamentals",
    "Apache Spark Complete Guide",
    "Hadoop Masterclass",
    "Data Warehousing Guide",
    "ETL Pipeline Development",
    "Data Engineering Bootcamp",
    "Apache Kafka Complete Guide",
    "Airflow for Data Engineers",
    "dbt Complete Guide",
    "Snowflake Masterclass",
  ]},

  // Machine Learning
  { category: "Machine Learning", courses: [
    "Machine Learning A-Z",
    "Deep Learning Complete Guide",
    "Neural Networks Masterclass",
    "TensorFlow 2.0 Complete Guide",
    "PyTorch for Deep Learning",
    "Keras Complete Guide",
    "Computer Vision with OpenCV",
    "Natural Language Processing",
    "Transformers & BERT Guide",
    "Large Language Models Guide",
    "GPT & ChatGPT Development",
    "Generative AI Masterclass",
    "Stable Diffusion Guide",
    "Reinforcement Learning",
    "Time Series Analysis",
    "Recommendation Systems",
    "Anomaly Detection Guide",
    "Object Detection with YOLO",
    "Image Classification Guide",
    "Sentiment Analysis Course",
    "Text Classification Guide",
    "Speech Recognition Guide",
    "GANs Complete Guide",
    "AutoML Masterclass",
    "MLOps Complete Guide",
    "Model Deployment Guide",
    "Scikit-learn Masterclass",
    "XGBoost & LightGBM Guide",
    "Feature Selection Guide",
    "Hyperparameter Tuning Guide",
  ]},

  // Mobile Development
  { category: "Mobile Development", courses: [
    "React Native Complete Guide",
    "Flutter Development Bootcamp",
    "iOS Development with Swift",
    "Android Development with Kotlin",
    "Expo React Native Guide",
    "Flutter & Firebase Guide",
    "React Native & Redux Guide",
    "Mobile UI/UX Design Guide",
    "App Store Optimization Guide",
    "Mobile App Testing Guide",
    "Ionic Framework Guide",
    "Xamarin Development Guide",
    "SwiftUI Complete Guide",
    "Jetpack Compose Guide",
    "Mobile Security Guide",
    "Push Notifications Guide",
    "Mobile Analytics Guide",
    "In-App Purchases Guide",
    "ARKit Development Guide",
    "ARCore Development Guide",
  ]},

  // DevOps
  { category: "DevOps", courses: [
    "Docker Complete Guide",
    "Kubernetes Masterclass",
    "AWS Complete Guide",
    "Google Cloud Platform Guide",
    "Microsoft Azure Complete Guide",
    "CI/CD Pipeline Guide",
    "Jenkins Complete Guide",
    "GitHub Actions Masterclass",
    "Terraform Masterclass",
    "Ansible Complete Guide",
    "Linux for DevOps",
    "Bash Scripting Guide",
    "Nginx Complete Guide",
    "Apache Web Server Guide",
    "Git & GitHub Masterclass",
    "DevSecOps Guide",
    "Site Reliability Engineering",
    "Prometheus & Grafana Guide",
    "ELK Stack Guide",
    "Helm Charts Guide",
    "ArgoCD Guide",
    "GitOps Complete Guide",
    "Cloud Security Guide",
    "Serverless Development Guide",
    "Microservices Architecture",
    "Service Mesh with Istio",
    "Infrastructure as Code",
    "Cost Optimization in Cloud",
    "AWS Lambda Complete Guide",
    "CloudFormation Guide",
  ]},

  // Design
  { category: "Design", courses: [
    "UI/UX Design Fundamentals",
    "Figma Complete Guide",
    "Adobe XD Masterclass",
    "Sketch Complete Guide",
    "Photoshop for Web Design",
    "Illustrator Complete Guide",
    "Logo Design Masterclass",
    "Brand Identity Design",
    "Motion Design with After Effects",
    "3D Design with Blender",
    "Typography Masterclass",
    "Color Theory Guide",
    "Design Systems Guide",
    "Prototyping & Wireframing",
    "User Research Methods",
    "Usability Testing Guide",
    "Accessibility in Design",
    "Mobile App Design Guide",
    "Dashboard Design Guide",
    "Landing Page Design Guide",
    "Print Design Guide",
    "Canva Masterclass",
    "Dribbble Portfolio Guide",
    "Design Thinking Guide",
    "Interaction Design Guide",
    "Icon Design Guide",
    "Illustration for UI",
    "Responsive Design Guide",
    "Dark Mode Design Guide",
    "Micro-interactions Guide",
  ]},

  // Business
  { category: "Business", courses: [
    "Digital Marketing Masterclass",
    "Social Media Marketing Guide",
    "Content Marketing Guide",
    "Email Marketing Masterclass",
    "SEO Complete Guide",
    "Google Ads Masterclass",
    "Facebook Ads Guide",
    "Instagram Marketing Guide",
    "YouTube Marketing Guide",
    "Affiliate Marketing Guide",
    "Dropshipping Complete Guide",
    "Amazon FBA Guide",
    "Entrepreneurship Masterclass",
    "Business Plan Writing Guide",
    "Financial Modeling Guide",
    "Excel for Business",
    "Project Management Guide",
    "Agile & Scrum Masterclass",
    "Product Management Guide",
    "Growth Hacking Guide",
    "Copywriting Masterclass",
    "Public Speaking Guide",
    "Leadership Masterclass",
    "Negotiation Skills Guide",
    "Sales Mastery Guide",
    "Customer Success Guide",
    "Startup Funding Guide",
    "E-commerce Complete Guide",
    "Freelancing Masterclass",
    "Personal Finance Guide",
  ]},

  // Other
  { category: "Other", courses: [
    "Cybersecurity Fundamentals",
    "Ethical Hacking Complete Guide",
    "Penetration Testing Guide",
    "Network Security Guide",
    "Blockchain Development Guide",
    "Solidity & Smart Contracts",
    "Web3 Development Guide",
    "NFT Development Guide",
    "Game Development with Unity",
    "Unreal Engine Guide",
    "C++ Game Development",
    "Java Complete Guide",
    "C# Masterclass",
    "Go Programming Guide",
    "Rust Programming Guide",
    "Kotlin Complete Guide",
    "Swift Programming Guide",
    "PHP Complete Guide",
    "Laravel Framework Guide",
    "Ruby on Rails Guide",
    "Scala Programming Guide",
    "Elixir Programming Guide",
    "Competitive Programming Guide",
    "Data Structures & Algorithms",
    "System Design Masterclass",
    "Interview Preparation Guide",
    "Technical Writing Guide",
    "Open Source Contribution Guide",
    "Quantum Computing Guide",
    "IoT Development Guide",
  ]},
];

const levels = ["Beginner", "Intermediate", "Advanced"];
const prices = [0, 0, 299, 499, 699, 999, 1299, 1499, 1999, 2499];

const getRandomItem = (arr) => arr[Math.floor(Math.random() * arr.length)];
const getRandomInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

const generateDescription = (title, category) => {
  return `Master ${title} with this comprehensive course. Learn everything from basics to advanced concepts in ${category}. This course includes hands-on projects, real-world examples, and industry best practices. Perfect for beginners and professionals looking to upgrade their skills.`;
};

const generateLessons = (courseTitle) => {
  const lessonTemplates = [
    `Introduction to ${courseTitle}`,
    "Setting Up Your Environment",
    "Core Concepts & Fundamentals",
    "Hands-on Practice",
    "Advanced Techniques",
    "Real World Projects",
    "Best Practices & Tips",
    "Common Mistakes to Avoid",
    "Performance Optimization",
    "Final Project & Next Steps",
  ];

  return lessonTemplates.map((title, i) => ({
    title,
    description: `Learn ${title.toLowerCase()} in depth with practical examples.`,
    videoUrl: `https://www.youtube.com/watch?v=dQw4w9WgXcQ`,
    duration: getRandomInt(10, 60),
    order: i + 1,
    isFree: i < 2,
  }));
};

// ─── Seed Function ────────────────────────────────────
const seedDatabase = async () => {
  try {
    await await mongoose.connect(process.env.MONGO_URI || process.env.MONGO_URL);;
    console.log("✅ MongoDB Connected");

    // Clear existing data
    console.log("🗑️  Clearing existing courses...");
    await Course.deleteMany({});

    // Create or find instructor account
    let instructor = await User.findOne({ email: "instructor@studyroom.com" });

    if (!instructor) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash("123456", salt);
      instructor = await User.create({
        name: "StudyRoom Instructor",
        email: "instructor@studyroom.com",
        password: hashedPassword,
        role: "instructor",
      });
      console.log("✅ Instructor account created!");
      console.log("   Email    : instructor@studyroom.com");
      console.log("   Password : 123456");
    } else {
      console.log("✅ Using existing instructor account");
    }

    // Generate all courses
    console.log("📚 Generating courses...");
    let totalCourses = 0;
    const allCourses = [];

    for (const template of courseTemplates) {
      for (const courseTitle of template.courses) {
        const price = getRandomItem(prices);
        allCourses.push({
          title: courseTitle,
          description: generateDescription(courseTitle, template.category),
          instructor: instructor._id,
          category: template.category,
          level: getRandomItem(levels),
          price,
          isPublished: true,
          lessons: generateLessons(courseTitle),
          averageRating: (Math.random() * 2 + 3).toFixed(1),
          enrolledStudents: [],
          ratings: [],
        });
        totalCourses++;
      }
    }

    // Insert all courses
    await Course.insertMany(allCourses);

    console.log(`\n🎉 SUCCESS! Generated ${totalCourses} courses!`);
    console.log("\n📊 Breakdown:");
    courseTemplates.forEach((t) => {
      console.log(`   ${t.category}: ${t.courses.length} courses`);
    });

    console.log("\n🔑 Login Details:");
    console.log("   Instructor Email    : instructor@studyroom.com");
    console.log("   Instructor Password : 123456");
    console.log("\n✅ Database seeded successfully!");
    process.exit(0);

  } catch (error) {
    console.error("❌ Seeding failed:", error.message);
    process.exit(1);
  }
};

seedDatabase();