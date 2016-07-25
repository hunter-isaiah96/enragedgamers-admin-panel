var theme_sel = document.getElementById("themes"),
    stylesheet = document.getElementById("cal_style"),
    themes = [".material_blue", ".material_red", ".material_orange", ".material_green", ".dark", ".confetti"];

for(var i = 0; i < themes.length; i++){
    var opt = document.createElement("option");
    opt.value = themes[i];
    opt.innerText = themes[i].slice(1).replace(/_/g," ");
    theme_sel.appendChild(opt);
}

theme_sel.addEventListener("change", function(e){
    stylesheet.href="dist/flatpickr"+e.target.value+".min.css";
    theme_sel.blur();
});