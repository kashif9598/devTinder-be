const express = require('express')
const app = express();


app.use('/test', (req,res) => {
    res.send("Hello World")
})
app.listen(8000, () => {
    console.log(`Server running on PORT 8000`);
})
