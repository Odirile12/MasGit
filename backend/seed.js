const mongoose = require('mongoose');
const User = require('./API/models/User');
const Project = require('./API/models/Project');
require('dotenv').config({ path: './db/config.env' });

const uri = `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_SECRET}@${process.env.MONGO_CLASTER}.g6b8see.mongodb.net/?retryWrites=true&w=majority&appName=${process.env.MONGO_CLASTER}`;

async function seedData() {
  try {
    await mongoose.connect(uri);
    console.log('Connected to MongoDB');

    // Clear existing data
    await User.deleteMany({});
    await Project.deleteMany({});
    console.log('Cleared existing data');

    // Create users
    const users = [
      {
        username: 'alex_dev',
        email: 'alex.dev@example.com',
        password: 'password123',
        name: 'Alex Developer',
        bio: 'Full-stack developer passionate about React and Node.js',
        role: 'user'
      },
      {
        username: 'sarah_designer',
        email: 'sarah.designer@example.com',
        password: 'password123',
        name: 'Sarah Designer',
        bio: 'UI/UX designer with a love for clean, modern interfaces',
        role: 'user'
      },
      {
        username: 'mike_engineer',
        email: 'mike.engineer@example.com',
        password: 'password123',
        name: 'Mike Engineer',
        bio: 'Software engineer specializing in backend systems',
        role: 'user'
      },
      {
        username: 'emma_coder',
        email: 'emma.coder@example.com',
        password: 'password123',
        name: 'Emma Coder',
        bio: 'Frontend developer who loves creating amazing user experiences',
        role: 'user'
      },
      {
        username: 'david_architect',
        email: 'david.architect@example.com',
        password: 'password123',
        name: 'David Architect',
        bio: 'System architect with expertise in scalable applications',
        role: 'user'
      },
      {
        username: 'lisa_analyst',
        email: 'lisa.analyst@example.com',
        password: 'password123',
        name: 'Lisa Analyst',
        bio: 'Data analyst and business intelligence specialist',
        role: 'user'
      },
      {
        username: 'tom_manager',
        email: 'tom.manager@example.com',
        password: 'password123',
        name: 'Tom Manager',
        bio: 'Project manager with 10+ years of experience',
        role: 'user'
      },
      {
        username: 'anna_tester',
        email: 'anna.tester@example.com',
        password: 'password123',
        name: 'Anna Tester',
        bio: 'Quality assurance engineer ensuring software excellence',
        role: 'user'
      },
      {
        username: 'ryan_mobile',
        email: 'ryan.mobile@example.com',
        password: 'password123',
        name: 'Ryan Mobile',
        bio: 'Mobile app developer for iOS and Android',
        role: 'user'
      },
      {
        username: 'jessica_devops',
        email: 'jessica.devops@example.com',
        password: 'password123',
        name: 'Jessica DevOps',
        bio: 'DevOps engineer automating deployment pipelines',
        role: 'user'
      }
    ];

    const createdUsers = await User.insertMany(users);
    console.log('Created', createdUsers.length, 'users');

    // Create friendships
    const friendships = [
      [0, 1], [0, 2], [0, 3], [1, 3], [1, 4], [2, 4], [2, 5],
      [3, 5], [3, 6], [4, 6], [4, 7], [5, 7], [5, 8], [6, 8],
      [6, 9], [7, 9], [0, 7], [1, 8], [2, 9]
    ];

    for (const [i, j] of friendships) {
      await User.findByIdAndUpdate(createdUsers[i]._id, {
        $push: { friends: createdUsers[j]._id }
      });
      await User.findByIdAndUpdate(createdUsers[j]._id, {
        $push: { friends: createdUsers[i]._id }
      });
    }
    console.log('Created friendships');

    // Create projects
    const projects = [
      {
        name: 'E-Commerce Platform',
        title: 'Modern E-Commerce Platform',
        description: 'A full-stack e-commerce solution with React frontend, Node.js backend, and MongoDB database. Features include user authentication, product catalog, shopping cart, payment integration, and order management.',
        owner: createdUsers[0]._id,
        ownerName: createdUsers[0].username,
        members: [createdUsers[0]._id, createdUsers[1]._id, createdUsers[2]._id],
        language: 'JavaScript',
        type: 'Web Application',
        hashtags: ['react', 'nodejs', 'mongodb', 'ecommerce', 'fullstack'],
        status: 'Active',
        isPrivate: false,
        files: [
          { name: 'package.json', type: 'json', path: '/projects/ecommerce/package.json', size: 1024 },
          { name: 'server.js', type: 'javascript', path: '/projects/ecommerce/server.js', size: 2048 },
          { name: 'App.js', type: 'javascript', path: '/projects/ecommerce/App.js', size: 3072 }
        ]
      },
      {
        name: 'Task Management App',
        title: 'Collaborative Task Management',
        description: 'A real-time task management application built with React and Socket.io. Users can create projects, assign tasks, set deadlines, and collaborate in real-time with team members.',
        owner: createdUsers[1]._id,
        ownerName: createdUsers[1].username,
        members: [createdUsers[1]._id, createdUsers[3]._id, createdUsers[4]._id],
        language: 'JavaScript',
        type: 'Web Application',
        hashtags: ['react', 'socketio', 'realtime', 'collaboration', 'productivity'],
        status: 'Active',
        isPrivate: false,
        files: [
          { name: 'index.html', type: 'html', path: '/projects/taskapp/index.html', size: 512 },
          { name: 'app.js', type: 'javascript', path: '/projects/taskapp/app.js', size: 4096 },
          { name: 'styles.css', type: 'css', path: '/projects/taskapp/styles.css', size: 1536 }
        ]
      },
      {
        name: 'Weather Dashboard',
        title: 'Interactive Weather Dashboard',
        description: 'A responsive weather dashboard that displays current weather conditions and forecasts for multiple cities. Built with React and integrates with OpenWeatherMap API.',
        owner: createdUsers[2]._id,
        ownerName: createdUsers[2].username,
        members: [createdUsers[2]._id, createdUsers[5]._id],
        language: 'JavaScript',
        type: 'Web Application',
        hashtags: ['react', 'api', 'weather', 'dashboard', 'responsive'],
        status: 'Completed',
        isPrivate: false,
        files: [
          { name: 'WeatherApp.jsx', type: 'javascript', path: '/projects/weather/WeatherApp.jsx', size: 2560 },
          { name: 'weatherService.js', type: 'javascript', path: '/projects/weather/weatherService.js', size: 1024 },
          { name: 'dashboard.css', type: 'css', path: '/projects/weather/dashboard.css', size: 2048 }
        ]
      },
      {
        name: 'Code Review Tool',
        title: 'Automated Code Review Tool',
        description: 'An AI-powered code review tool that analyzes code quality, suggests improvements, and helps maintain coding standards across development teams.',
        owner: createdUsers[3]._id,
        ownerName: createdUsers[3].username,
        members: [createdUsers[3]._id, createdUsers[6]._id, createdUsers[7]._id],
        language: 'Python',
        type: 'Desktop Application',
        hashtags: ['python', 'ai', 'machinelearning', 'codereview', 'automation'],
        status: 'Active',
        isPrivate: false,
        files: [
          { name: 'main.py', type: 'python', path: '/projects/codereview/main.py', size: 3072 },
          { name: 'analyzer.py', type: 'python', path: '/projects/codereview/analyzer.py', size: 4096 },
          { name: 'requirements.txt', type: 'text', path: '/projects/codereview/requirements.txt', size: 256 }
        ]
      },
      {
        name: 'Social Media Analytics',
        title: 'Social Media Analytics Platform',
        description: 'A comprehensive analytics platform for social media management. Track engagement, analyze audience demographics, and generate detailed reports for marketing campaigns.',
        owner: createdUsers[4]._id,
        ownerName: createdUsers[4].username,
        members: [createdUsers[4]._id, createdUsers[5]._id, createdUsers[8]._id],
        language: 'JavaScript',
        type: 'Web Application',
        hashtags: ['analytics', 'socialmedia', 'marketing', 'dashboard', 'reporting'],
        status: 'Active',
        isPrivate: false,
        files: [
          { name: 'analytics.js', type: 'javascript', path: '/projects/analytics/analytics.js', size: 5120 },
          { name: 'charts.js', type: 'javascript', path: '/projects/analytics/charts.js', size: 3584 },
          { name: 'api.js', type: 'javascript', path: '/projects/analytics/api.js', size: 2048 }
        ]
      },
      {
        name: 'Mobile Fitness App',
        title: 'Cross-Platform Fitness Tracker',
        description: 'A mobile fitness application built with React Native that tracks workouts, monitors health metrics, and provides personalized training plans.',
        owner: createdUsers[8]._id,
        ownerName: createdUsers[8].username,
        members: [createdUsers[8]._id, createdUsers[0]._id, createdUsers[9]._id],
        language: 'JavaScript',
        type: 'Mobile Application',
        hashtags: ['reactnative', 'fitness', 'health', 'mobile', 'tracking'],
        status: 'Active',
        isPrivate: false,
        files: [
          { name: 'App.js', type: 'javascript', path: '/projects/fitness/App.js', size: 4096 },
          { name: 'WorkoutScreen.js', type: 'javascript', path: '/projects/fitness/WorkoutScreen.js', size: 3072 },
          { name: 'HealthService.js', type: 'javascript', path: '/projects/fitness/HealthService.js', size: 2048 }
        ]
      },
      {
        name: 'Data Visualization Library',
        title: 'Interactive Data Visualization Library',
        description: 'A JavaScript library for creating interactive data visualizations. Supports charts, graphs, and dashboards with smooth animations and responsive design.',
        owner: createdUsers[5]._id,
        ownerName: createdUsers[5].username,
        members: [createdUsers[5]._id, createdUsers[1]._id],
        language: 'JavaScript',
        type: 'Library',
        hashtags: ['javascript', 'dataviz', 'charts', 'library', 'interactive'],
        status: 'Active',
        isPrivate: false,
        files: [
          { name: 'Chart.js', type: 'javascript', path: '/projects/dataviz/Chart.js', size: 6144 },
          { name: 'utils.js', type: 'javascript', path: '/projects/dataviz/utils.js', size: 2048 },
          { name: 'README.md', type: 'markdown', path: '/projects/dataviz/README.md', size: 1024 }
        ]
      },
      {
        name: 'DevOps Automation Suite',
        title: 'Complete DevOps Automation Suite',
        description: 'A comprehensive DevOps toolkit including CI/CD pipelines, infrastructure as code, monitoring, and automated deployment scripts.',
        owner: createdUsers[9]._id,
        ownerName: createdUsers[9].username,
        members: [createdUsers[9]._id, createdUsers[6]._id, createdUsers[7]._id],
        language: 'Shell',
        type: 'DevOps Tools',
        hashtags: ['devops', 'automation', 'cicd', 'infrastructure', 'monitoring'],
        status: 'Active',
        isPrivate: false,
        files: [
          { name: 'deploy.sh', type: 'shell', path: '/projects/devops/deploy.sh', size: 2048 },
          { name: 'Dockerfile', type: 'dockerfile', path: '/projects/devops/Dockerfile', size: 512 },
          { name: 'docker-compose.yml', type: 'yaml', path: '/projects/devops/docker-compose.yml', size: 1024 }
        ]
      },
      {
        name: 'Learning Management System',
        title: 'Educational LMS Platform',
        description: 'A complete learning management system for online education. Features course creation, student enrollment, progress tracking, and interactive assessments.',
        owner: createdUsers[6]._id,
        ownerName: createdUsers[6].username,
        members: [createdUsers[6]._id, createdUsers[1]._id, createdUsers[3]._id, createdUsers[4]._id],
        language: 'JavaScript',
        type: 'Web Application',
        hashtags: ['education', 'lms', 'courses', 'learning', 'assessment'],
        status: 'Active',
        isPrivate: false,
        files: [
          { name: 'courseManager.js', type: 'javascript', path: '/projects/lms/courseManager.js', size: 4096 },
          { name: 'studentPortal.js', type: 'javascript', path: '/projects/lms/studentPortal.js', size: 3584 },
          { name: 'assessment.js', type: 'javascript', path: '/projects/lms/assessment.js', size: 2560 }
        ]
      },
      {
        name: 'IoT Home Automation',
        title: 'Smart Home IoT System',
        description: 'An Internet of Things system for home automation. Control lights, temperature, security systems, and appliances through a mobile app and voice commands.',
        owner: createdUsers[7]._id,
        ownerName: createdUsers[7].username,
        members: [createdUsers[7]._id, createdUsers[8]._id, createdUsers[9]._id],
        language: 'Python',
        type: 'IoT Application',
        hashtags: ['iot', 'smarthome', 'automation', 'python', 'raspberrypi'],
        status: 'On Hold',
        isPrivate: false,
        files: [
          { name: 'homeController.py', type: 'python', path: '/projects/iot/homeController.py', size: 3072 },
          { name: 'sensorManager.py', type: 'python', path: '/projects/iot/sensorManager.py', size: 2048 },
          { name: 'app.py', type: 'python', path: '/projects/iot/app.py', size: 1536 }
        ]
      },
      {
        name: 'Blockchain Voting System',
        title: 'Secure Blockchain Voting Platform',
        description: 'A decentralized voting system built on blockchain technology. Ensures transparency, security, and immutability of election results.',
        owner: createdUsers[0]._id,
        ownerName: createdUsers[0].username,
        members: [createdUsers[0]._id, createdUsers[2]._id, createdUsers[6]._id],
        language: 'Solidity',
        type: 'Blockchain Application',
        hashtags: ['blockchain', 'voting', 'security', 'ethereum', 'decentralized'],
        status: 'Active',
        isPrivate: true,
        files: [
          { name: 'Voting.sol', type: 'solidity', path: '/projects/blockchain/Voting.sol', size: 4096 },
          { name: 'deploy.js', type: 'javascript', path: '/projects/blockchain/deploy.js', size: 2048 },
          { name: 'test.js', type: 'javascript', path: '/projects/blockchain/test.js', size: 1536 }
        ]
      }
    ];

    const createdProjects = await Project.insertMany(projects);
    console.log('Created', createdProjects.length, 'projects');

    // Update user projects arrays
    for (const project of createdProjects) {
      await User.findByIdAndUpdate(project.owner, {
        $push: { projects: project._id }
      });
      for (const memberId of project.members) {
        if (memberId.toString() !== project.owner.toString()) {
          await User.findByIdAndUpdate(memberId, {
            $push: { projects: project._id }
          });
        }
      }
    }
    console.log('Updated user project references');

    console.log('Database seeded successfully!');
    console.log('Created users:', createdUsers.map(u => u.username));
    console.log('Created projects:', createdProjects.map(p => p.name));

  } catch (error) {
    console.error('Error seeding database:', error);
  } finally {
    await mongoose.connection.close();
    console.log('Database connection closed');
  }
}

seedData();


// Nkosi@05M12
// Nkosi@gmail.com