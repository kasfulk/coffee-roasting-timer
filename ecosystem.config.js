module.exports = {
    apps: [
      {
        name: "coffee-roasting-timer",
        script: "npm",
        args: "run serve",
        watch: true,
        env: {
          "PORT": 6070
        }
      }
    ]
  }
  