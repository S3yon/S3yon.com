// Runs in <head> (see layout.tsx) so a reload always starts at the intro: the browser's
// scroll restore is off, a leftover #work hash is dropped, and the page snaps to the top.
export const scrollBootScript = `(function(){try{history.scrollRestoration='manual';if(location.hash)history.replaceState(null,'',location.pathname+location.search);var top=function(){window.scrollTo({top:0,left:0,behavior:'instant'})};top();addEventListener('load',top);}catch(e){}})();`;
