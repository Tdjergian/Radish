import React from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import App from './App.jsx';
import PricingPage from './Pages/PricingPage.jsx';
import PricingForm from './components/PricingForm.jsx';
import Slider from './components/Slider.jsx';
import Main from './container/Main.jsx';
import store from './Redux/store.js';
import '../public/style.css';

const container = document.getElementById('app');
const root = createRoot(container);

root.render(
  <Provider store={store}>
    <Router>
      <Routes>
          <Route path="/" element={<App />}>
            <Route index element={<Main />} />
            <Route path="/pricing" element={<PricingForm />} />
          </Route>
      </Routes>
    </Router>
  </Provider>
);
