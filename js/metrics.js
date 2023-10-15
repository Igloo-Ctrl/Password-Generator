function metrics() {
    const key = "visitOrRefreshCount"
    if (localStorage.getItem(key)) {
        let currentCount = parseInt(localStorage.getItem(key));
        localStorage.setItem(key, (currentCount + 1).toString())
    }
    else {
        localStorage.setItem(key, 1);
    }
}

metrics();