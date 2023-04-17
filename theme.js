import { createVuetify } from 'vuetify';

const themes = createVuetify({
    theme: {
        defaultTheme: 'dark',
        themes: {
            lightTheme: {
                dark: false,
                colors: {
                    background: '#FFFFFF',
                    surface: '#FFFFFF',
                    primary: '#6200EE',
                    'primary-darken-1': '#3700B3',
                    secondary: '#03DAC6',
                    'secondary-darken-1': '#018786',
                    error: '#B00020',
                    info: '#2196F3',
                    success: '#4CAF50',
                    warning: '#FB8C00',
                    rating: '#DAA520'
                }
            },
            darkTheme: {
                dark: true,
                colors: {
                    background: '#FFFFFF',
                    surface: '#000000',
                    primary: '#6200EE',
                    'primary-darken-1': '#3700B3',
                    secondary: '#03DAC6',
                    'secondary-darken-1': '#018786',
                    error: '#B00020',
                    info: '#2196F3',
                    success: '#4CAF50',
                    warning: '#FB8C00',
                    rating: '#DAA520',
                    gray: '#a6a6a6'
                }
            }
        }
    }
});

export default themes;
