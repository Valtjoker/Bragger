const bcrypt = require('bcryptjs');
const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync("admin", salt);
    // const randomIp = randomIpv4();

    // data.password = hash
    console.log(hash);