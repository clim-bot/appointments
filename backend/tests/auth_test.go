package tests

import (
    "encoding/json"
    "net/http"
    "net/http/httptest"
    "strings"
    "testing"

    "github.com/stretchr/testify/assert"
)

func TestProfile(t *testing.T) {
    router := setupRouter()

    req, _ := http.NewRequest("GET", "/settings", nil)
    req.Header.Set("Content-Type", "application/json")
    w := httptest.NewRecorder()
    router.ServeHTTP(w, req)

    assert.Equal(t, http.StatusOK, w.Code)

    var response map[string]interface{}
    json.Unmarshal(w.Body.Bytes(), &response)
    assert.NotEmpty(t, response["user"])
}

func TestChangePassword(t *testing.T) {
    router := setupRouter()

    payload := `{"oldPassword":"oldpassword","newPassword":"newpassword","confirmPassword":"newpassword"}`
    req, _ := http.NewRequest("POST", "/settings/change-password", strings.NewReader(payload))
    req.Header.Set("Content-Type", "application/json")
    w := httptest.NewRecorder()
    router.ServeHTTP(w, req)

    assert.Equal(t, http.StatusOK, w.Code)

    var response map[string]string
    json.Unmarshal(w.Body.Bytes(), &response)
    assert.Equal(t, "Password changed successfully", response["message"])
}
