const fs = require('fs-extra');
const path = require('path');
const imageSize = require('image-size');

const rootPath="gallery/"

class PhotoExtension {
    constructor() {
        this.size = 64;
        this.offset = [0, 0];
    }
}

class Photo {
    constructor() {
        this.dirName = '';
        this.fileName = '';
        this.iconID = '';
        this.extension = new PhotoExtension();
    }
}

class PhotoGroup {
    constructor() {
        this.name = '';
        this.children = [];
    }
}

function createPlotIconsData() {
    let allPlots = [];
    let allPlotGroups = [];

    const plotJsonFile = path.join(__dirname, './photosInfo.json');
    const plotGroupJsonFile = path.join(__dirname, './photos.json');

    if (fs.existsSync(plotJsonFile)) {
        allPlots = JSON.parse(fs.readFileSync(plotJsonFile));
    }

    if (fs.existsSync(plotGroupJsonFile)) {
        allPlotGroups = JSON.parse(fs.readFileSync(plotGroupJsonFile));
    }

    fs.readdirSync(__dirname).forEach(function(dirName) {
        const stats = fs.statSync(path.join(__dirname, dirName));
        const isDir = stats.isDirectory();
        if (isDir) {
            const subfiles = fs.readdirSync(path.join(__dirname, dirName));
            subfiles.forEach(function(subfileName) {
                // 如果已经存在 则不再处理
                // if (allPlots.find(o => o.fileName === subfileName && o.dirName === dirName)) {
                //     return;
                // }

                // 新增标
                const plot = new Photo();
                plot.dirName = dirName;
                plot.fileName = subfileName;
                const imageInfo = imageSize(rootPath+dirName + "/" + subfileName);
                plot.iconID = imageInfo.width + '.' + imageInfo.height + ' ' + subfileName;
                allPlots.push(plot);
                console.log(`RD: createPlotIconsData -> new plot`, plot);

                // 为新增标添加分组 暂时以它所处的文件夹为分组
                let group = allPlotGroups.find(o => o.name === dirName);
                if (!group) {
                    group = new PhotoGroup();
                    group.name = dirName;
                    allPlotGroups.push(group);
                    console.log(`RD: createPlotIconsData -> new group`, group);
                }
                group.children.push(plot.iconID);
            });
        }
    });

    fs.writeJSONSync(plotJsonFile, allPlots);
    fs.writeJSONSync(plotGroupJsonFile, allPlotGroups);
}

createPlotIconsData();
