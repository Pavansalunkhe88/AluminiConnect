const express = require('express');
const router = express.Router();

router.get('/', (req, res)=> {
    console.log(`Hey, I am Alumni`);
    res.send(`Hey, buddies.!!`);
})

module.exports = router;