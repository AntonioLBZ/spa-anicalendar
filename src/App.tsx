import './App.css';
import './themes.css';
import { useState, useEffect } from 'react';
import { Body, Card, Header } from './components';

function App() {
    const [theme, setTheme] = useState('dark');

    useEffect(() => {
        document.body.className = theme === 'light' ? 'light' : '';
    }, [theme]);

    return (
        <div className="calendar-app">
            <Header />
            <Body>
                <button
                    onClick={() =>
                        setTheme(theme === 'dark' ? 'light' : 'dark')
                    }
                >
                    Toggle Theme
                </button>
                {theme}
                <Card />
            </Body>
        </div>
    );
}

export default App;
