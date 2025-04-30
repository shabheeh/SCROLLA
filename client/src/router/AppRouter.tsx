import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Hero } from "../pages/Hero";
import ArticleFeed from "../pages/ArticleFeed";
import ArticleView from "../pages/ArticleView";
import AddArticle from "../pages/AddArticle";
import UserProfilePage from "../pages/Profile";
import ProtectedRoute from "./ProtectedRoute";


export const AppRouter = () => {


    return (
      <Router>
        <Routes>
          <Route path="/" element={<Hero />} />
          <Route path="/feed" element={<ProtectedRoute><ArticleFeed /></ProtectedRoute>} />
          <Route path="/:article" element={<ProtectedRoute><ArticleView /></ProtectedRoute>} />
          <Route path="/write" element={<ProtectedRoute><AddArticle /></ProtectedRoute>} />
          <Route path="/profile" element={<ProtectedRoute><UserProfilePage /></ProtectedRoute>} />
        </Routes>
      </Router>
    );
  };
  