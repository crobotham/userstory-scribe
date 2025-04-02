
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { ToastProvider } from "@/contexts/ToastContext";
import ProtectedRoute from "@/components/ProtectedRoute";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import Dashboard from "./pages/Dashboard";
import StoryManagement from "./pages/StoryManagement";
import NotFound from "./pages/NotFound";
import Contact from "./pages/Contact";
import About from "./pages/About";
import Profile from "./pages/Profile";
import Pricing from "./pages/Pricing";
import SignUp from "./pages/SignUp";
import Support from "./pages/Support";
import Blog from "./pages/Blog";
import BlogPost from "./pages/BlogPost";
import BlogForm from "./pages/BlogForm";

const queryClient = new QueryClient();

const App = () => {
  console.log("App component rendering");
  
  return (
    <QueryClientProvider client={queryClient}>
      <ToastProvider>
        <BrowserRouter>
          <AuthProvider>
            <TooltipProvider>
              <Routes>
                <Route path="/auth" element={<Auth />} />
                <Route path="/signup" element={<SignUp />} />
                <Route path="/" element={<Index />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/about" element={<About />} />
                <Route path="/pricing" element={<Pricing />} />
                <Route path="/support" element={<Support />} />
                <Route path="/blog" element={<Blog />} />
                <Route path="/blog/:id" element={<BlogPost />} />
                <Route 
                  path="/blog/new" 
                  element={
                    <ProtectedRoute adminOnly={true}>
                      <BlogForm />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/blog/edit/:id" 
                  element={
                    <ProtectedRoute adminOnly={true}>
                      <BlogForm />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/dashboard" 
                  element={
                    <ProtectedRoute>
                      <Dashboard />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/projects" 
                  element={
                    <ProtectedRoute>
                      <StoryManagement />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/profile" 
                  element={
                    <ProtectedRoute>
                      <Profile />
                    </ProtectedRoute>
                  } 
                />
                <Route path="*" element={<NotFound />} />
              </Routes>
              {/* Place toasters at the app level */}
              <Toaster />
              <Sonner position="top-right" />
            </TooltipProvider>
          </AuthProvider>
        </BrowserRouter>
      </ToastProvider>
    </QueryClientProvider>
  );
};

export default App;
