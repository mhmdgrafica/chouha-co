const fs = require("fs");
const path = require("path");

function readDirRecursive(dir, baseDir, output = []) {
  const files = fs.readdirSync(dir);

  files.forEach(file => {
    const fullPath = path.join(dir, file);
    const relativePath = path.relative(baseDir, fullPath);

    const stat = fs.statSync(fullPath);

    if (stat.isDirectory()) {
      readDirRecursive(fullPath, baseDir, output);
    } else {
      try {
        const content = fs.readFileSync(fullPath, "utf8");

        output.push(
`===== ${relativePath} =====
${content}

`
        );
      } catch (err) {
        output.push(
`===== ${relativePath} =====
[Cannot read file]

`
        );
      }
    }
  });

  return output;
}

// 📌 اسم المجلد من command line
const targetDir = process.argv[2];

if (!targetDir) {
  console.log("❌ حط اسم المجلد");
  process.exit(1);
}

const fullPath = path.resolve(targetDir);

if (!fs.existsSync(fullPath)) {
  console.log("❌ المجلد مش موجود");
  process.exit(1);
}

const result = readDirRecursive(fullPath, fullPath).join("\n");

// 📄 اسم الملف الناتج
const outputFile = path.join(process.cwd(), "output.txt");

fs.writeFileSync(outputFile, result, "utf8");

console.log("✅ تم إنشاء الملف:", outputFile);