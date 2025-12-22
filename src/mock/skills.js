// src/mock/skills.js
import { v4 as uuidv4 } from 'uuid';

export const CATEGORIES = [
    {
        name: 'Technology & Programming',
        subcategories: ['Web Development', 'Mobile Development', 'Data Science', 'Cloud Computing']
    },
    {
        name: 'Design',
        subcategories: ['Graphic Design', 'UI/UX Design', '3D Modeling', 'Animation']
    },
    {
        name: 'Languages',
        subcategories: ['English', 'Arabic', 'French', 'Chinese', 'Urdu']
    },
    {
        name: 'Business',
        subcategories: ['Marketing', 'Finance', 'Entrepreneurship', 'Management']
    },
    {
        name: 'Arts & Crafts',
        subcategories: ['Painting', 'Music', 'Cooking', 'Photography']
    },
    {
        name: 'Academics',
        subcategories: ['Mathematics', 'Physics', 'Chemistry', 'Biology']
    }
];

export const MOCK_SKILLS = [
    {
        id: '1',
        title: 'Complete Web Development Bootcamp 2024',
        mentorName: 'Ali Hassan',
        mentorId: 'mentor-1',
        mentorAvatar: 'https://i.pravatar.cc/150?u=ali',
        mentorBio: 'Senior Full Stack Developer with 10+ years of experience in MERN stack. I help students land their first dev job.',
        category: 'Technology & Programming',
        subcategory: 'Web Development',
        description: 'Learn HTML, CSS, JavaScript, React, and Node.js from scratch. Build real-world projects and get ready for a career in web development.',
        rating: 4.8,
        reviewsCount: 124,
        mode: 'Online',
        city: 'Lahore',
        priceCash: 28000,
        priceCredits: 35,
        priceType: 'both', // 'cash', 'credits', 'both'
        tags: ['React', 'Node.js', 'Web Dev'],
        image: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=800&q=80',
        duration: '40 Hours',
        lectures: 156,
        level: 'Beginner',
        learnings: [
            'Build 16 web development projects for your portfolio',
            'Learn the latest technologies, including JavaScript, React, Node and even Web3 development',
            'Master frontend development with React',
            'Master backend development with Node',
            'Learn professional developer best practices'
        ],
        content: [
            {
                title: 'Introduction to Web Development',
                duration: '2h 15m',
                lessons: [
                    'How the internet works',
                    'Setting up your development environment',
                    'HTML 5 Basics'
                ]
            },
            {
                title: 'CSS Styling and Layouts',
                duration: '5h 30m',
                lessons: [
                    'CSS Selectors and Rules',
                    'Box Model',
                    'Flexbox and Grid',
                    'Responsive Design'
                ]
            },
            {
                title: 'JavaScript Fundamentals',
                duration: '10h 0m',
                lessons: [
                    'Variables and Data Types',
                    'Functions and Switch Statements',
                    'DOM Manipulation',
                    'Advanced JS Concepts'
                ]
            }
        ]
    },
    {
        id: '2',
        title: 'Professional Graphic Design Masterclass',
        mentorName: 'Sara Khan',
        mentorId: 'mentor-2',
        mentorAvatar: 'https://i.pravatar.cc/150?u=sara',
        mentorBio: 'Award-winning Graphic Designer specializing in brand identity and editorial design.',
        category: 'Design',
        subcategory: 'Graphic Design',
        description: 'Master Adobe Photoshop, Illustrator, and InDesign. Learn design principles, typography, and color theory.',
        rating: 4.9,
        reviewsCount: 89,
        mode: 'Online',
        city: 'Karachi',
        priceCash: 25000,
        priceCredits: 30,
        priceType: 'both',
        tags: ['Photoshop', 'Illustrator', 'Design'],
        image: 'https://images.unsplash.com/photo-1626785774573-4b799314348d?auto=format&fit=crop&w=800&q=80',
        duration: '25 Hours',
        lectures: 85,
        level: 'Intermediate',
        learnings: [
            'Deep understanding of typography, color theory, photos, layout and blocking',
            'Master Adobe Photoshop, Illustrator and InDesign',
            'Create logos and brand packages',
            'Learn photo editing and manipulation'
        ],
        content: [
            {
                title: 'Graphic Design Theory',
                duration: '4h 0m',
                lessons: ['Typography', 'Color Theory', 'Layout & Composition']
            },
            {
                title: 'Adobe Photoshop Mastery',
                duration: '8h 0m',
                lessons: ['Interface Overview', 'Layers & Masks', 'Retouching', 'Photo Manipulation']
            },
            {
                title: 'Adobe Illustrator & Branding',
                duration: '7h 0m',
                lessons: ['Vector Graphics', 'Logo Design', 'Brand Identity']
            }
        ]
    },
    {
        id: '3',
        title: 'Spoken English for Professionals',
        mentorName: 'Usman Zafar',
        mentorId: 'mentor-3',
        mentorAvatar: 'https://i.pravatar.cc/150?u=usman',
        mentorBio: 'Certified TEFL instructor helping professionals communicate effectively in global environments.',
        category: 'Languages',
        subcategory: 'English',
        description: 'Improve your fluency, pronunciation, and confidence in business meetings and presentations.',
        rating: 4.7,
        reviewsCount: 56,
        mode: 'Online',
        city: 'Islamabad',
        priceCash: 18000,
        priceCredits: 22,
        priceType: 'both',
        tags: ['English', 'Communication', 'Business'],
        image: 'https://images.unsplash.com/photo-1543269865-cbf427effbad?auto=format&fit=crop&w=800&q=80',
        duration: '15 Hours',
        lectures: 24,
        level: 'All Levels',
        learnings: [
            'Speak English confidently and naturally',
            'Master business vocabulary and idioms',
            'Improve pronunciation and accent',
            'Email writing and presentation skills'
        ],
        content: [
            {
                title: 'Foundations of Fluency',
                duration: '3h 0m',
                lessons: ['Overcoming fear of speaking', 'Essential Grammar review', 'Pronunciation basics']
            },
            {
                title: 'Business Communication',
                duration: '5h 0m',
                lessons: ['Meeting etiquette', 'Negotiation skills', 'Professional emails']
            }
        ]
    },
    // ... other items would be similarly updated, kept brief for this example
    {
        id: '4',
        title: 'Traditional Oil Painting Workshop',
        mentorName: 'Fatima Ahmed',
        mentorId: 'mentor-4',
        mentorAvatar: 'https://i.pravatar.cc/150?u=fatima',
        mentorBio: 'Fine Artist exhibiting in galleries across Pakistan. Passionate about teaching traditional techniques.',
        category: 'Arts & Crafts',
        subcategory: 'Painting',
        description: 'Learn the fundamentals of oil painting, color mixing, and composition in this hands-on workshop.',
        rating: 5.0,
        reviewsCount: 32,
        mode: 'In-Person',
        city: 'Lahore',
        priceCash: 22000,
        priceCredits: null,
        priceType: 'cash',
        tags: ['Art', 'Painting', 'Oil'],
        image: 'https://images.unsplash.com/photo-1579783902614-a3fb39279c23?auto=format&fit=crop&w=800&q=80',
        duration: '2 Days (Weekend Workshop)',
        lectures: 8,
        level: 'Beginner',
        learnings: ['Color mixing', 'Brush techniques', 'Composition', 'Canvas preparation'],
        content: []
    },
    {
        id: '5',
        title: 'Digital Marketing Strategies 101',
        mentorName: 'Bilal Raza',
        mentorId: 'mentor-5',
        mentorAvatar: 'https://i.pravatar.cc/150?u=bilal',
        mentorBio: 'Digital Marketing expert.',
        category: 'Business',
        subcategory: 'Marketing',
        description: 'Learn SEO, SEM, Social Media Marketing, and Email Marketing strategies to grow your business.',
        rating: 4.6,
        reviewsCount: 45,
        mode: 'Online',
        city: 'Karachi',
        priceCash: 16000,
        priceCredits: 20,
        priceType: 'both',
        tags: ['Marketing', 'SEO', 'Business'],
        image: 'https://images.unsplash.com/photo-1533750516457-a7f992034fec?auto=format&fit=crop&w=800&q=80',
        duration: '10 Hours',
        lectures: 20,
        level: 'Intermediate',
        learnings: ['SEO Basics', 'Facebook Ads', 'Google Analytics'],
        content: []
    },
    {
        id: '6',
        title: 'Physics Tutoring for O/A Levels',
        mentorName: 'Dr. Ayesha Malik',
        mentorId: 'mentor-6',
        mentorAvatar: 'https://i.pravatar.cc/150?u=ayesha',
        mentorBio: 'PhD in Physics. 15 years of teaching experience.',
        category: 'Academics',
        subcategory: 'Physics',
        description: 'Comprehensive physics tutoring covering mechanics, electricity, and thermodynamics.',
        rating: 4.9,
        reviewsCount: 78,
        mode: 'In-Person',
        city: 'Islamabad',
        priceCash: 24000,
        priceCredits: 30,
        priceType: 'both',
        tags: ['Physics', 'Academics', 'Tutoring'],
        image: 'https://images.unsplash.com/photo-1636466497217-26a8cbeaf0aa?auto=format&fit=crop&w=800&q=80',
        duration: 'Weekly Sessions',
        lectures: 12,
        level: 'High School',
        learnings: ['Mechanics', 'Electricity', 'Magnetism'],
        content: []
    },
    {
        id: '7',
        title: 'Urdu Poetry and Literature',
        mentorName: 'Iftikhar Hussain',
        mentorId: 'mentor-7',
        mentorAvatar: 'https://i.pravatar.cc/150?u=iftikhar',
        mentorBio: 'Urdu Literature Professor.',
        category: 'Languages',
        subcategory: 'Urdu',
        description: 'Explore the depths of Urdu poetry, Iqbal, Ghalib, and modern literature.',
        rating: 4.8,
        reviewsCount: 22,
        mode: 'Online',
        city: 'Multan',
        priceCash: 15000,
        priceCredits: 18,
        priceType: 'both',
        tags: ['Urdu', 'Poetry', 'Literature'],
        image: 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?auto=format&fit=crop&w=800&q=80',
        duration: '12 Hours',
        lectures: 10,
        level: 'All Levels',
        learnings: ['Poetry Analysis', 'History of Urdu', 'Creative Writing'],
        content: []
    },
    {
        id: '8',
        title: 'Freelancing & Entrepreneurship Guide',
        mentorName: 'Zainab Bibi',
        mentorId: 'mentor-8',
        mentorAvatar: 'https://i.pravatar.cc/150?u=zainab',
        mentorBio: 'Top Rated Upwork Freelancer.',
        category: 'Business',
        subcategory: 'Entrepreneurship',
        description: 'How to start your freelancing career on Upwork and Fiverr. Tips for success and client management.',
        rating: 4.7,
        reviewsCount: 150,
        mode: 'Online',
        city: 'Faisalabad',
        priceCash: 20000,
        priceCredits: 25,
        priceType: 'both',
        tags: ['Freelancing', 'Upwork', 'Fiverr'],
        image: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=800&q=80',
        duration: '8 Hours',
        lectures: 15,
        level: 'Beginner',
        learnings: ['Profile Creation', 'Proposal Writing', 'Client Communication'],
        content: []
    }
];
