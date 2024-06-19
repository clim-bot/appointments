package tests

import (
    "net/http"
    "net/http/httptest"
    "testing"

    "github.com/stretchr/testify/assert"
)

func TestDownloadReport(t *testing.T) {
    router := setupRouter()

    req, _ := http.NewRequest("GET", "/download-report?client=Test Client", nil)
    req.Header.Set("Content-Type", "application/json")
    w := httptest.NewRecorder()
    router.ServeHTTP(w, req)

    assert.Equal(t, http.StatusOK, w.Code)
    assert.Equal(t, "text/csv", w.Header().Get("Content-Type"))
}
