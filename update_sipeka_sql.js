const fs = require('fs');
const path = require('path');
const bcrypt = require('bcryptjs');

async function main() {
  const sqlPath = path.join(__dirname, 'sipeka.sql');
  if (!fs.existsSync(sqlPath)) {
    console.error("sipeka.sql not found!");
    return;
  }
  
  const sqlContent = fs.readFileSync(sqlPath, 'utf8');

  // 1. Generate the password hash for 'kesbangFol'
  const hashedPassword = bcrypt.hashSync("kesbangFol", 10);
  console.log("Generated hash for 'kesbangFol':", hashedPassword);

  // 2. Extract pegawai map (id -> nip)
  const pegawaiMap = new Map();
  
  const pegawaiInsertRegex = /INSERT INTO `pegawai` \([^)]+\) VALUES\s*([\s\S]*?);/g;
  let match;
  while ((match = pegawaiInsertRegex.exec(sqlContent)) !== null) {
    const valuesStr = match[1];
    // Tuple starts with id and nip: ('id_str', 'nip_str', ...
    const tupleRegex = /\('([^']+)',\s*'([^']+)'/g;
    let tupleMatch;
    while ((tupleMatch = tupleRegex.exec(valuesStr)) !== null) {
      pegawaiMap.set(tupleMatch[1], tupleMatch[2]);
    }
  }

  console.log(`Found ${pegawaiMap.size} pegawai records mapping.`);

  // 3. Replace user inserts
  const userInsertRegex = /INSERT INTO `user` \(`id`, `email`, `password`, `role`, `pegawaiId`, `createdAt`, `updatedAt`\) VALUES\s*([\s\S]*?);/g;
  
  const newSqlContent = sqlContent.replace(userInsertRegex, (fullMatch, valuesBlock) => {
    // Replace each tuple inside the values block
    const tupleRegex = /\('([^']+)',\s*'([^']+)',\s*'([^']+)',\s*'([^']+)',\s*(NULL|'[^']+'),\s*'([^']+)',\s*'([^']+)'\)/g;
    
    const newValuesBlock = valuesBlock.replace(tupleRegex, (tMatch, id, email, password, role, pegawaiIdStr, createdAt, updatedAt) => {
      let pegawaiId = pegawaiIdStr;
      if (pegawaiIdStr !== 'NULL') {
        pegawaiId = pegawaiIdStr.replace(/'/g, '');
      }

      let newUsername = email; 
      if (pegawaiId !== 'NULL' && pegawaiMap.has(pegawaiId)) {
        newUsername = pegawaiMap.get(pegawaiId);
      }

      return `('${id}', '${newUsername}', '${hashedPassword}', '${role}', ${pegawaiIdStr}, '${createdAt}', '${updatedAt}')`;
    });

    return `INSERT INTO \`user\` (\`id\`, \`email\`, \`password\`, \`role\`, \`pegawaiId\`, \`createdAt\`, \`updatedAt\`) VALUES\n${newValuesBlock};`;
  });

  fs.writeFileSync(sqlPath, newSqlContent, 'utf8');
  console.log("Successfully updated sipeka.sql!");
  console.log("Usernames have been replaced with NIP and passwords set to 'kesbangFol'.");
}

main().catch(console.error);
