

function getParameter(parameterName) {
    let parameter = new URLSearchParams(window.location.search);
    return parameter.get(parameterName);
}

function setUrlParameter() {
    var gridWidth = getParameter("w")
    if (gridWidth != null) {
        grid.length = gridWidth;
    }
}




