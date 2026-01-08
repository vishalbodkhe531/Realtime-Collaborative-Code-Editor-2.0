
export const getSavedfiles = async () => {
    try {
        const response = await fetch('/api/getSavedfiles');

        if (!response.ok) {
            throw new Error("Failed to fetch files");
        }

        const data = await response.json();
        console.log('Fetched files:', data);

        return data.savedFiles ?? [];
    } catch (error) {
        console.error('Error fetching files:', error);
        return [];
    }
};
