import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './index.css';
import Layout from './components/Layout';
import Home from './components/Home';
import SolutionDetail from './components/SolutionDetail';
import CategoryPage from './components/CategoryPage';
import SearchResults from './components/SearchResults';
import Bookmarks from './components/Bookmarks';
import About from './components/About';
import FAQ from './components/FAQ';
import SuggestSolution from './components/SuggestSolution';
import PopularSolutions from './components/PopularSolutions';
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';
import Profile from './components/Auth/Profile';
import { ThemeProvider } from './contexts/ThemeContext';
import { RecentlyViewedProvider } from './contexts/RecentlyViewedContext';
import { FilterProvider } from './contexts/FilterContext';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/Auth/ProtectedRoute';

export function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <RecentlyViewedProvider>
          <FilterProvider>
            <Router>
              <Layout>
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/category/:categoryId" element={<CategoryPage />} />
                  <Route path="/solution/:solutionId" element={<SolutionDetail />} />
                  <Route path="/search" element={<SearchResults />} />
                  <Route 
                    path="/bookmarks" 
                    element={
                      <ProtectedRoute>
                        <Bookmarks />
                      </ProtectedRoute>
                    } 
                  />
                  <Route path="/about" element={<About />} />
                  <Route path="/faq" element={<FAQ />} />
                  <Route 
                    path="/suggest" 
                    element={
                      <ProtectedRoute>
                        <SuggestSolution />
                      </ProtectedRoute>
                    } 
                  />
                  <Route path="/popular" element={<PopularSolutions />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/register" element={<Register />} />
                  <Route 
                    path="/profile" 
                    element={
                      <ProtectedRoute>
                        <Profile />
                      </ProtectedRoute>
                    } 
                  />
                  <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
              </Layout>
            </Router>
          </FilterProvider>
        </RecentlyViewedProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
