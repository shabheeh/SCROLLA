
import { Search, Bell, Bookmark, ThumbsUp, MessageSquare, Share2, Compass, Home, Hash, Edit, Users } from 'lucide-react';
import { Avatar } from '../components/ui/avatar';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Separator } from '../components/ui/separator';
import { Badge } from '../components/ui/badge';

// Dummy data for articles
const articles = [
  {
    id: 1,
    title: '7 React Patterns That Made Me a Better Front-End Developer',
    subtitle: 'And Probably Saved Me From Smashing My Laptop Into a Wall',
    author: 'Daniel Scott',
    publication: 'Full Stack Forge',
    date: 'Apr 11',
    readTime: '12 min read',
    comments: 42,
    likes: 156,
    image: '/api/placeholder/400/300',
    tag: 'React'
  },
  {
    id: 2,
    title: 'Never Introduce yourself as a developer, Here\'s Why??',
    subtitle: 'When someone asks you what you do, what\'s your go-to response?',
    author: 'Neha Gupta',
    publication: 'Dev Simplified',
    date: 'Jan 27',
    readTime: '6 min read',
    comments: 84,
    likes: 339,
    image: '/api/placeholder/400/300',
    tag: 'Career'
  },
  {
    id: 3,
    title: 'The JavaScript Trick Every Developer Should Know',
    subtitle: 'This simple pattern will change how you write code forever',
    author: 'Benoit Ruiz',
    publication: 'Better Programming',
    date: 'Mar 15',
    readTime: '8 min read',
    comments: 28,
    likes: 219,
    image: '/api/placeholder/400/300',
    tag: 'JavaScript'
  },
  {
    id: 4,
    title: 'Understanding React Server Components in 2025',
    subtitle: 'Everything you need to know about the future of React',
    author: 'Sarah Chen',
    publication: 'React Daily',
    date: 'Apr 02',
    readTime: '15 min read',
    comments: 52,
    likes: 287,
    image: '/api/placeholder/400/300',
    tag: 'React'
  }
];

// Dummy data for staff picks
const staffPicks = [
  {
    id: 101,
    title: 'Your story matters: Join us on April 25th for Draft Day 2025',
    author: 'Scott Lamb',
    publication: 'The Scrolla Blog',
    date: 'Apr 17',
    avatar: '/api/placeholder/50/50'
  },
  {
    id: 102,
    title: 'I worked for Pope Francis. Here is what he was really like.',
    author: 'Daniel B. Gallagher',
    date: '3d ago',
    avatar: '/api/placeholder/50/50'
  },
  {
    id: 103,
    title: 'My Notes App Is a Beautiful Mess of Creativity and Chaos',
    author: 'Vaibhavi Naik',
    date: 'Apr 17',
    avatar: '/api/placeholder/50/50'
  }
];

// Navigation categories
const categories = [
  { name: 'For you', icon: <Home className="h-5 w-5" /> },
  { name: 'Following', icon: <Users className="h-5 w-5" /> },
  { name: 'Featured', icon: <Compass className="h-5 w-5" />, badge: 'New' },
  { name: 'Popular', icon: <Hash className="h-5 w-5" /> }
];

const ScrollaFeed = () => {
  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur">
        <div className="container flex h-16 items-center justify-between px-4 md:px-6">
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold">SCROLLA</h1>
          </div>
          <div className="relative w-full max-w-sm px-4">
            <Search className="absolute left-6 top-1/2 h-4 w-4 -translate-y-1/2 transform text-muted-foreground" />
            <Input
              className="w-full rounded-full bg-muted/70 pl-10 border-none"
              placeholder="Search"
              type="search"
            />
          </div>
          <div className="flex items-center gap-4">
            
            
            <Button className="rounded-full" variant="ghost">
              <Edit className="h-5 w-5" />
            </Button>
            <Avatar className="h-8 w-8 cursor-pointer">
              <img src="/api/placeholder/40/40" alt="User" />
            </Avatar>
          </div>
        </div>
        
        <div className="container justify-center px-4 md:px-6 flex overflow-x-auto pb-2 gap-1 scrollbar-hide">
          {categories.map((category, index) => (
            <Button 
              key={category.name}
              variant={index === 0 ? "outline" : "ghost"} 
              size="sm" 
              className="flex-shrink-0 rounded-full"
            >
              {category.icon}
              <span className="ml-2">{category.name}</span>
              {category.badge && (
                <Badge className="ml-2 bg-green-500 text-white" variant="outline">{category.badge}</Badge>
              )}
            </Button>
          ))}
        </div>
      </header>

      {/* Main content */}
      <main className="container grid grid-cols-1 gap-6 p-4 md:grid-cols-12 md:p-6 mx-20 lg:gap-10">

        {/* Articles feed */}
        <div className="md:col-span-7">
          {articles.map((article, index) => (
            <div key={article.id} className="mb-8">
              <div className="flex items-center gap-2 mb-2">
                <Avatar className="h-6 w-6">
                  <img src="/api/placeholder/30/30" alt={article.author} />
                </Avatar>
                <span className="text-sm font-medium">
                  In {article.publication} by {article.author}
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="md:col-span-2">
                  <h2 className="text-xl font-bold mb-1 md:text-2xl">{article.title}</h2>
                  <p className="text-muted-foreground mb-2">{article.subtitle}</p>
                  
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <span>{article.date}</span>
                    <span>{article.readTime}</span>
                    <Badge variant="outline" className="rounded-full">{article.tag}</Badge>
                  </div>
                </div>
                <div className="md:col-span-1">
                  <img 
                    src={article.image} 
                    alt={article.title}
                    className="w-full h-40 object-cover rounded-md"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between mt-4">
                <div className="flex items-center gap-4">
                  <Button variant="ghost" size="sm" className="gap-1 rounded-full">
                    <ThumbsUp className="h-4 w-4" />
                    <span>{article.likes}</span>
                  </Button>
                  <Button variant="ghost" size="sm" className="gap-1 rounded-full">
                    <MessageSquare className="h-4 w-4" />
                    <span>{article.comments}</span>
                  </Button>
                </div>
                <Button variant="ghost" size="sm" className="rounded-full">
                  <Share2 className="h-4 w-4" />
                </Button>
              </div>
              
              {index < articles.length - 1 && <Separator className="mt-8" />}
            </div>
          ))}
        </div>

        {/* Right sidebar */}
        <div className="md:col-span-4 space-y-8">
          {/* Staff picks */}
          <div className="bg-background p-6 rounded-lg">
            <h2 className="font-bold text-xl mb-4">Staff Picks</h2>
            <div className="space-y-6">
              {staffPicks.map((pick, index) => (
                <div key={pick.id}>
                  <div className="flex gap-3 group cursor-pointer">
                    <Avatar className="h-10 w-10 flex-shrink-0">
                      <img src={pick.avatar} alt={pick.author} />
                    </Avatar>
                    <div>
                      {pick.publication && (
                        <div className="flex items-center gap-2 mb-1">
                          <Avatar className="h-5 w-5">
                            <img src="/api/placeholder/20/20" alt="Publication" />
                          </Avatar>
                          <span className="text-xs">In {pick.publication} by {pick.author}</span>
                        </div>
                      )}
                      {!pick.publication && (
                        <span className="text-sm font-medium">{pick.author}</span>
                      )}
                      <h3 className="font-medium">{pick.title}</h3>
                      <span className="text-xs text-muted-foreground">{pick.date}</span>
                    </div>
                  </div>
                  {index < staffPicks.length - 1 && <Separator className="my-4" />}
                </div>
              ))}
            </div>
            <Button variant="link" className="px-0 mt-4">See the full list</Button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ScrollaFeed;