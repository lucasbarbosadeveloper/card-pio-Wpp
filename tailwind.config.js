/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,js}"],
  theme: {
    extend: {
      fontFamily: {
        poppins: ["Poppins", "sans-serif"],
      },
  
      colors: {
        c_red: "#FF3131",
        c_green: "#54CC0A" ,
        c_gray: "#F6F7F78"
      },

      backgroundImage: {
        'bg': "url('../assets/bg.png')"
      },

      boxShadow:{
        'custonShadow': "0px 0px 10px #00000050"
      }
    },

  },
  plugins: [],
}

