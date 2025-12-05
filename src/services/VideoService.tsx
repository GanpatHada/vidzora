const pixabayKey = import.meta.env.VITE_PIXABAY_API_KEY as string;

export async function fetchPopularVideos(page = 1) {
  const url = `https://pixabay.com/api/videos/?key=${pixabayKey}&order=popular&per_page=10&page=${page}`;

  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP error: ${response.status}`);
    }
    const data = await response.json();
    return { success: true, data };
  } catch (error) {
    return { success: false, error };
  }
}



