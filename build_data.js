const fs = require('fs');
const path = require('path');

const baseDir = path.join(__dirname, 'images', 'Photos');
const categories = ['Studio', 'Graduation', 'headshots', 'Beauty', 'Automotive'];

let portfolioData = {};

categories.forEach(category => {
    const catPath = path.join(baseDir, category);
    if (!fs.existsSync(catPath) || !fs.statSync(catPath).isDirectory()) return;

    portfolioData[category] = [];
    
    // Check if there are image files directly in this category folder
    const files = fs.readdirSync(catPath);
    const directImages = [];
    let directCoverImage = "";
    
    files.forEach(file => {
        const filePath = path.join(catPath, file);
        if (fs.statSync(filePath).isFile() && /\.(png|jpe?g|webp)$/i.test(file)) {
            const imgPath = `images/Photos/${category}/${file}`;
            directImages.push(imgPath);
            if (file.startsWith('cover-')) {
                directCoverImage = imgPath;
            }
        }
    });

    if (directImages.length > 0) {
        if (!directCoverImage) {
            directCoverImage = directImages[0];
        }
        portfolioData[category].push({
            id: `${category.toLowerCase()}-shoot`,
            title: category,
            category: category,
            coverImage: directCoverImage,
            images: directImages
        });
    }
    
    const shoots = fs.readdirSync(catPath);
    shoots.forEach(shoot => {
        const shootPath = path.join(catPath, shoot);
        if (!fs.statSync(shootPath).isDirectory()) return;

        const shootId = `${category.toLowerCase()}-${shoot.toLowerCase().replace(/ /g, '-')}`;
        const images = [];
        let coverImage = "";

        const files = fs.readdirSync(shootPath);
        files.forEach(file => {
            if (/\.(png|jpe?g|webp)$/i.test(file)) {
                // Keep the relative web path using forward slashes
                const imgPath = `images/Photos/${category}/${shoot}/${file}`;
                images.push(imgPath);
                if (file.startsWith('cover-')) {
                    coverImage = imgPath;
                }
            }
        });

        if (!coverImage && images.length > 0) {
            coverImage = images[0];
        }

        portfolioData[category].push({
            id: shootId,
            title: shoot,
            category: category,
            coverImage: coverImage,
            images: images
        });
    });
});



const jsContent = `const portfolioData = ${JSON.stringify(portfolioData, null, 4)};\n`;
fs.writeFileSync('portfolio-data.js', jsContent);
console.log('Successfully generated portfolio-data.js');
