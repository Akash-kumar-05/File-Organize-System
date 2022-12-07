#!/usr/bin/env node
let path = require("path");
let fs = require("fs");
const { clearScreenDown } = require("readline");


let inputArr = process.argv.slice(2);

let types = {
    media: ["mp4", "mkv"],
    archives: ['zip', '7z', 'rar', 'tar', 'gz', 'ar', 'iso', "xz"],
    documents: ['docx', 'doc', 'pdf', 'xlsx', 'xls', 'odt', 'ods', 'odp', 'odg', 'odf', 'txt', 'ps', 'tex'],
    app: ['exe', 'dmg', 'pkg', "deb"]
}

let command = inputArr[0];
switch (command) {
    case "help":
        helpFn();
        break;

    case "tree":
        treeFn(inputArr[1]);
        break;

    case "organize":
        organizeFile(inputArr[1]);
        break;

    default:
        console.log("Please ✍ type right input");
}

function treeFn(dirPath) {
    if (dirPath == undefined) {
        treeHelper(process.cwd(), "");
        return;
    }
    else {
        let doesExist = fs.existsSync(dirPath);
        if (doesExist) {
            treeHelper(dirPath, "");
        }
        else {
            console.log("kindly provide right path");
            return;
        }
    }
}

function treeHelper(dirPath, indent) {
    let isFile = fs.lstatSync(dirPath).isFile();
    if (isFile == true) {
        let fileName = path.basename(dirPath);
        console.log(indent + "├──" + fileName);
    }
    else {
        let dirName = path.basename(dirPath);
        console.log(indent + "└──" + dirName);
        let childNames = fs.readdirSync(dirPath);
        for (let i = 0; i < childNames.length; i++) {
            let childPath = path.join(dirPath, childNames[i]);
            treeHelper(childPath, indent + "\t");
        }
    }

}

function organizeFile(dirPath) {
    let destPath;
    if (dirPath == undefined) {
        destPath = process.cwd();
        return;
    }
    else {
        let doesExist = fs.existsSync(dirPath);
        if (doesExist) {
            destPath = path.join(dirPath, "organized_files");
            if (fs.existsSync(destPath) == false) {
                fs.mkdirSync(destPath);
            }
        }
        else {
            console.log("kindly provide right path");
            return;
        }
    }

    organizerHelper(dirPath, destPath);
}


function organizerHelper(src, destPath) {
    let childNames = fs.readdirSync(src);
    for (i = 0; i < childNames.length; i++) {
        let childAddress = path.join(src, childNames[i]);
        let isFile = fs.lstatSync(childAddress).isFile();
        if (isFile) {
            console.log(childNames[i]);

            let category = getCategory(childNames[i]);
            console.log(childNames[i], "belongs to", category);
            sendFile(childAddress, destPath, category);
        }

    }
}

function sendFile(srcFilePath, destPath, category) {
    let categoryPath = path.join(destPath, category);
    if (fs.existsSync(categoryPath) == false) {
        fs.mkdirSync(categoryPath);
    }

    let fileName = path.basename(srcFilePath);
    let destFilePath = path.join(categoryPath, fileName);
    fs.copyFileSync(srcFilePath, destFilePath);
    fs.unlinkSync(srcFilePath);

}


function getCategory(name) {
    let ext = path.extname(name);
    ext = ext.slice(1);

    for (let type in types) {
        let cTypesArr = types[type];
        for (let i = 0; i < cTypesArr.length; i++) {
            if (ext == cTypesArr[i]) {
                return type;
            }
        }

    }

    return "others";

}

function helpFn() {
    console.log(`
    List of All the commands:
                 node main.js tree "directoryPath"
                 node main.js organize "directoryPath"
                 node main.js help
                `);
}