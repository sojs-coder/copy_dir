const source = process.argv[2];
const dest = process.argv[3];

const fs = require('fs');
// check if source/dest are provided
if (!source || !dest) {
    console.log('Please provide source and destination paths');
    process.exit(1);
}
// check if they are valid
if (!fs.existsSync(source)) {
    console.log('Source path does not exist');
    process.exit(1);
}
if (!fs.existsSync(dest)) {
    // create the destination directory
    fs.mkdirSync(dest);
}



// check if the source/dests are files or directories
const sIsDir = fs.statSync(source).isDirectory();
const dIsDir = fs.statSync(dest).isDirectory();


function getItems(source){
    const files = [];
    const dirs = [];

    const items = fs.readdirSync(source, { withFileTypes: true });
    items.forEach(item => {
        if (item.isDirectory()) {
            dirs.push(item.name);
        } else {
            files.push(item.name);
        }
    });
    return { files, dirs };
}
function copyDir(dir,dest){
    const items = getItems(dir);
    items.files.forEach(file => {
        fs.copyFileSync(`${dir}/${file}`, `${dest}/${file}`);
    });
    items.dirs.forEach(subdir => {
        fs.mkdirSync(`${dest}/${subdir}`);
        copyDir(`${dir}/${subdir}`, `${dest}/${subdir}`)
    });
}

if (sIsDir) {
    if (dIsDir) {
        copyDir(source, dest);
    } else {
        console.log('Destination is not a directory');
    }
} else {
    console.log('Source is not a directory');
}