

function getParameter(parameterName) {
    let parameter = new URLSearchParams(window.location.search);
    return parameter.get(parameterName);
}

function getUrlParameter() {
    var gridWidth = getParameter("w")
    if (gridWidth != null && gridWidth >= 4 && gridWidth <= 16) {
        grid.length = gridWidth;
    }
}

