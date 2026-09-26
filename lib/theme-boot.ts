export const THEME_KEY = 'theme';

// Runs in <head> before paint (see layout.tsx) so a saved dark choice never flashes light.
export const themeBootScript = `(function(){try{var t=localStorage.getItem('${THEME_KEY}');if(!t)t=matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light';if(t==='dark')document.documentElement.classList.add('dark');}catch(e){}})();`;
