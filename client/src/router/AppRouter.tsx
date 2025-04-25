import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Hero } from "../pages/Hero";
import { useAuth } from "../contexts/authContext";
import Feed from "../pages/Feed";
import ScrollaArticlePage from "../pages/ArticleView";


export const AppRouter = () => {

    const user = useAuth()

    return(
        <Router>
            <Routes>
                <Route path="/" element={ user ? <Feed /> : <Hero />} />
                <Route path="/view" element={<ScrollaArticlePage />} />
            </Routes>
        </Router>
    )
}