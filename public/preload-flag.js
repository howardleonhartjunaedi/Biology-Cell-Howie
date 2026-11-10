try {
  if (!sessionStorage.getItem('sel:preloaded')) document.documentElement.classList.add('preloading');
} catch (error) {
  document.documentElement.classList.remove('preloading');
}
