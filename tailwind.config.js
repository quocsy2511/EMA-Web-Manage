/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,js}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        dark: "#2b2c37",
        secondary: "#635fc7",
        secondaryHover: "#635fc740",
        btnSecondary: "#635fc71a",
        darkDropDown: "#00000080",
        darkShadow: "#364e7e1a",
        darkSecondary: "#20212c",
        sideBarBg: "#d6e3f8",
        textCol: "#828fa3",
        bgSubtask: "#f4f7fd",
        text4: "#B2B3BD",
        lite: "#FCFCFD",
        // dark: "#13131A",
        // darkSecondary: "#1C1C24",
        darkStrock: "#3A3A43",
        text3: "#808191",
        bgHeader: "#fafbfc",
        bgBoard: "#ffffff",
        bgColumn: "#F4F5F7",
        bgG: "#F3F4F8",
        success: "#20bcbb",
        blueBudget: "#1f2c73",
        blueSecondBudget: "#7184ad",
        bgCardBudget: "#2F2CD8",
      },
    },
    fontFamily: {
      'nunito': ["Nunito", "sans-serif"],
    },
  },
  plugins: [require("tailwind-scrollbar-hide")],
};
