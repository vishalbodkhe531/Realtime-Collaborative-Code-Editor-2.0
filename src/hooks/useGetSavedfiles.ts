
export const getSavedfiles = async () => {
    try {
        const response = await fetch('/api/getSavedfiles');

        const data = await response.json();

        return data.savedFiles ?? [];
    } catch (error) {
        console.error('Error fetching files:', error);
        return [];
    }
};
