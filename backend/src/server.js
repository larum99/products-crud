const app = require("./app");

module.exports = app;

const PORT = process.env.PORT || 4200;

app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
