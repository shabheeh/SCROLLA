import React from 'react';
import { Search, Bell, Bookmark, ThumbsUp, MessageSquare, Share2, Home, Users, Compass, Hash, ArrowLeft, BookmarkPlus, Hand, Flag } from 'lucide-react';
import { Avatar } from '../components/ui/avatar';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Separator } from '../components/ui/separator';
import { Badge } from '../components/ui/badge';

// Article content
const article = {
  id: 1,
  title: '7 React Patterns That Made Me a Better Front-End Developer',
  subtitle: 'And Probably Saved Me From Smashing My Laptop Into a Wall',
  author: 'Daniel Scott',
  authorBio: 'Senior Frontend Developer at TechCorp. React enthusiast and educator.',
  authorFollowers: '3.2K',
  publication: 'Full Stack Forge',
  date: 'Apr 11, 2025',
  readTime: '12 min read',
  comments: 42,
  likes: 156,
  bookmarks: 82,
  tag: 'React',
  image: '/api/placeholder/800/400',
  authorAvatar: '/api/placeholder/80/80',
  publicationAvatar: '/api/placeholder/40/40',
};

// Related articles recommendations
const relatedArticles = [
  {
    id: 101,
    title: "The Future of React: What's Coming in 2026",
    author: 'Sarah Chen',
    publication: 'React Daily',
    date: 'Apr 19',
    readTime: '8 min read',
    image: '/api/placeholder/400/250',
    tag: 'React'
  },
  {
    id: 102,
    title: 'How I Built a Design System with React and TypeScript',
    author: 'Miguel Rodriguez',
    publication: 'UX Collective',
    date: 'Apr 15',
    readTime: '10 min read',
    image: '/api/placeholder/400/250',
    tag: 'Design Systems'
  },
  {
    id: 103,
    title: 'React Performance Optimization Techniques You Should Know',
    author: 'Priya Patel',
    publication: 'Better Programming',
    date: 'Apr 7',
    readTime: '14 min read',
    image: '/api/placeholder/400/250',
    tag: 'Performance'
  }
];

// Comments
const comments = [
  {
    id: 201,
    author: 'Alex Johnson',
    avatar: '/api/placeholder/50/50',
    text: 'The custom hooks pattern literally changed my life as a developer. Great article!',
    date: '2d ago',
    likes: 24,
    replies: 3,
  },
  {
    id: 202,
    author: 'Maya Williams',
    avatar: '/api/placeholder/50/50',
    text: "I've been developing with React for 5 years and still learned new tricks from this article. Thanks for sharing!",
    date: '3d ago',
    likes: 18,
    replies: 1,
  },
  {
    id: 203,
    author: 'Rajiv Mehta',
    avatar: '/api/placeholder/50/50',
    text: "Pattern #4 was eye-opening. I've been doing it wrong all along. Going to refactor my code this weekend.",
    date: '4d ago',
    likes: 12,
    replies: 0,
  }
];

// Navigation categories
const categories = [
  { name: 'For you', icon: <Home className="h-5 w-5" /> },
  { name: 'Following', icon: <Users className="h-5 w-5" /> },
  { name: 'Featured', icon: <Compass className="h-5 w-5" />, badge: 'New' },
  { name: 'Popular', icon: <Hash className="h-5 w-5" /> }
];

const ScrollaArticlePage = () => {
  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur">
        <div className="container flex h-16 items-center justify-between px-4 md:px-6">
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold">Scrolla</h1>
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
            <Button variant="ghost" size="icon" className="rounded-full">
              <Bell className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon" className="rounded-full">
              <Bookmark className="h-5 w-5" />
            </Button>
            <Button className="rounded-full" variant="default">
              Write
            </Button>
            <Avatar className="h-8 w-8 cursor-pointer">
              <img src="/api/placeholder/40/40" alt="User" />
            </Avatar>
          </div>
        </div>
        
        {/* Categories navigation */}
        <div className="container px-4 md:px-6 flex overflow-x-auto pb-2 gap-1 scrollbar-hide">
          {categories.map((category, index) => (
            <Button 
              key={category.name}
              variant={index === 0 ? "default" : "ghost"} 
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
      <main className="container grid grid-cols-1 gap-6 p-4 md:grid-cols-12 md:p-6 lg:gap-10">
        {/* Left sidebar - Categories */}
        <div className="hidden md:col-span-1 md:flex md:flex-col">
          <Button variant="ghost" className="justify-start px-2 rounded-full mb-6">
            <span className="h-8 w-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-bold">+</span>
          </Button>
          <nav className="mt-4 flex flex-col gap-3">
            {categories.map((category, index) => (
              <Button 
                key={category.name}
                variant={index === 0 ? "default" : "ghost"} 
                className="justify-start rounded-full"
              >
                {category.icon}
                <span className="ml-2">{category.name}</span>
                {category.badge && (
                  <Badge className="ml-2 bg-green-500 text-white" variant="outline">{category.badge}</Badge>
                )}
              </Button>
            ))}
          </nav>
          
          {/* Back button - visible on article page */}
          <Button variant="ghost" className="justify-start rounded-full mt-8">
            <ArrowLeft className="h-5 w-5 mr-2" />
            <span>Back to feed</span>
          </Button>
        </div>

        {/* Article content */}
        <div className="md:col-span-7">
          {/* Publication info */}
          <div className="flex items-center gap-3 mb-4">
            <Avatar className="h-8 w-8">
              <img src={article.publicationAvatar} alt={article.publication} />
            </Avatar>
            <div>
              <h3 className="font-medium">{article.publication}</h3>
              <p className="text-sm text-muted-foreground">A publication for developers building the future</p>
            </div>
            <Button variant="outline" size="sm" className="ml-auto rounded-full">
              Follow
            </Button>
          </div>
          
          {/* Article title and subtitle */}
          <h1 className="text-3xl font-bold mb-2 md:text-4xl">{article.title}</h1>
          <p className="text-xl text-muted-foreground mb-6">{article.subtitle}</p>
          
          {/* Author info */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <Avatar className="h-12 w-12">
                <img src={article.authorAvatar} alt={article.author} />
              </Avatar>
              <div>
                <div className="flex items-center">
                  <h3 className="font-medium">{article.author}</h3>
                  <Badge variant="outline" className="ml-2 rounded-full text-xs">
                    <Hand className="h-3 w-3 mr-1" />
                    Top Writer
                  </Badge>
                </div>
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <span>{article.date} · {article.readTime}</span>
                  <span>{article.authorFollowers} followers</span>
                </div>
              </div>
            </div>
            <Button variant="outline" size="sm" className="rounded-full">
              Follow
            </Button>
          </div>
          
          {/* Article hero image */}
          <div className="mb-8">
            <img 
              src={article.image} 
              alt={article.title}
              className="w-full h-auto aspect-video object-cover rounded-lg"
            />
            <p className="text-sm text-muted-foreground mt-2">Image: React code on a developer's screen</p>
          </div>
          
          {/* Article content */}
          <div className="prose max-w-none mb-8">
            <p>In the world of React development, writing code that works is just the beginning. Writing code that's maintainable, scalable, and doesn't make you want to throw your laptop out the window six months later? That's the real challenge.</p>
            
            <p>When I started with React five years ago, I was making every mistake in the book. My components were bloated, my state management was chaotic, and my code reviews... well, let's just say they weren't fun for anyone involved.</p>
            
            <h2>Pattern #1: Custom Hooks for Shared Logic</h2>
            
            <p>If you find yourself copying and pasting the same useEffect and useState combinations across multiple components, it's time to create a custom hook.</p>
            
            <pre><code>{`function useFetchData(url) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await fetch(url);
        const json = await response.json();
        setData(json);
        setError(null);
      } catch (err) {
        setError(err.message);
        setData(null);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [url]);

  return { data, loading, error };
}`}</code></pre>
            
            <p>This pattern alone reduced my component code by about 30% and made testing significantly easier.</p>
            
            <h2>Pattern #2: Component Composition Over Props Drilling</h2>
            
            <p>I used to create massive components with dozens of props that would be passed down through multiple levels. It was a nightmare to maintain. Then I discovered the power of component composition.</p>
            
            <p>Instead of this:</p>
            
            <pre><code>{`<Table 
  data={data}
  onSort={handleSort}
  sortColumn={sortColumn}
  onFilter={handleFilter}
  filterValues={filterValues}
  onPageChange={handlePageChange}
  currentPage={currentPage}
  pageSize={pageSize}
  // ... 10 more props
/>`}</code></pre>
            
            <p>I now do this:</p>
            
            <pre><code>{`<Table>
  <Table.Header>
    <Table.Sort column={sortColumn} onSort={handleSort} />
    <Table.Filter values={filterValues} onChange={handleFilter} />
  </Table.Header>
  <Table.Body data={data} />
  <Table.Footer>
    <Table.Pagination 
      currentPage={currentPage}
      pageSize={pageSize}
      onPageChange={handlePageChange}
    />
  </Table.Footer>
</Table>`}</code></pre>
            
            <p>This approach is more readable, maintainable, and makes it much easier to modify parts of the component without affecting others.</p>
            
            <h2>Pattern #3: State Machines for Complex UI</h2>
            
            <p>When your component has multiple states that interact with each other, boolean flags and nested ternaries quickly become unmanageable. State machines to the rescue!</p>
            
            <p>I could go on with the remaining patterns, but these first three have already transformed my approach to React development. The code is cleaner, more maintainable, and—most importantly—doesn't make me want to find a new career every time I have to revisit an old project.</p>
            
            <p>In the next part of this series, I'll cover the remaining patterns and show how they all work together to create a robust React architecture. Stay tuned!</p>
          </div>
          
          {/* Article footer - Tags */}
          <div className="flex flex-wrap gap-2 mb-8">
            <Badge variant="outline" className="rounded-full px-4 py-2">{article.tag}</Badge>
            <Badge variant="outline" className="rounded-full px-4 py-2">Frontend</Badge>
            <Badge variant="outline" className="rounded-full px-4 py-2">JavaScript</Badge>
            <Badge variant="outline" className="rounded-full px-4 py-2">Web Development</Badge>
          </div>
          
          {/* Article interactions */}
          <div className="flex items-center justify-between mb-8">
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
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm" className="gap-1 rounded-full">
                <BookmarkPlus className="h-4 w-4" />
                <span>{article.bookmarks}</span>
              </Button>
              <Button variant="ghost" size="sm" className="rounded-full">
                <Share2 className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="sm" className="rounded-full">
                <Flag className="h-4 w-4" />
              </Button>
            </div>
          </div>
          
          <Separator className="mb-8" />

          <div className="mb-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold">Comments ({article.comments})</h2>
              <Button variant="outline" size="sm" className="rounded-full">
                Most relevant
              </Button>
            </div>
            
            {/* Add comment */}
            <div className="flex gap-4 mb-8">
              <Avatar className="h-10 w-10">
                <img src="/api/placeholder/40/40" alt="User" />
              </Avatar>
              <div className="flex-1">
                <Input 
                  className="w-full bg-muted/50 border-none" 
                  placeholder="Add a comment..."
                />
              </div>
            </div>
            
            {/* Comments */}
            <div className="space-y-6">
              {comments.map((comment) => (
                <div key={comment.id} className="flex gap-4">
                  <Avatar className="h-10 w-10">
                    <img src={comment.avatar} alt={comment.author} />
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-medium">{comment.author}</h4>
                      <span className="text-xs text-muted-foreground">{comment.date}</span>
                    </div>
                    <p className="mb-2">{comment.text}</p>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <Button variant="ghost" size="sm" className="gap-1 h-8 rounded-full">
                        <ThumbsUp className="h-3 w-3" />
                        <span>{comment.likes}</span>
                      </Button>
                      <Button variant="ghost" size="sm" className="h-8 rounded-full">Reply</Button>
                      {comment.replies > 0 && (
                        <Button variant="link" size="sm" className="h-8 rounded-full">
                          View {comment.replies} {comment.replies === 1 ? 'reply' : 'replies'}
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            <Button variant="outline" className="w-full mt-6 rounded-full">
              Show more comments
            </Button>
          </div>
        </div>

        {/* Right sidebar */}
        <div className="md:col-span-4 space-y-8">
          {/* Author card - sticky */}
          <div className="sticky top-32 bg-background p-6 rounded-lg border">
            <div className="flex items-center gap-4 mb-4">
              <Avatar className="h-16 w-16">
                <img src={article.authorAvatar} alt={article.author} />
              </Avatar>
              <div>
                <h3 className="text-lg font-bold">{article.author}</h3>
                <p className="text-sm text-muted-foreground">{article.authorFollowers} followers</p>
              </div>
            </div>
            <p className="text-sm mb-4">{article.authorBio}</p>
            <Button className="w-full rounded-full">Follow</Button>
            <Separator className="my-6" />
            <h4 className="font-bold mb-4">More from {article.author}</h4>
            <div className="space-y-4">
              <div className="group cursor-pointer">
                <h5 className="font-medium group-hover:text-primary">10 TypeScript Tips That Will Make Your Code More Readable</h5>
                <p className="text-sm text-muted-foreground">Mar 27 · 8 min read</p>
              </div>
              <div className="group cursor-pointer">
                <h5 className="font-medium group-hover:text-primary">Debugging React: A Systematic Approach</h5>
                <p className="text-sm text-muted-foreground">Feb 15 · 11 min read</p>
              </div>
              <div className="group cursor-pointer">
                <h5 className="font-medium group-hover:text-primary">My Frontend Developer Toolkit for 2025</h5>
                <p className="text-sm text-muted-foreground">Jan 3 · 9 min read</p>
              </div>
            </div>
            <Button variant="link" className="px-0 mt-4">See all</Button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ScrollaArticlePage;