package tests

import (
    "encoding/json"
    "net/http"
    "net/http/httptest"
    "strings"
    "testing"

    "github.com/stretchr/testify/assert"
    "myapp/models"
)

func TestCreateClient(t *testing.T) {
    router := setupRouter()

    client := models.Client{
        Name:        "Test Client",
        Address:     "123 Test St",
        State:       "CA",
        ZipCode:     "90001",
        PhoneNumber: "555-1234",
    }
    jsonValue, _ := json.Marshal(client)
    req, _ := http.NewRequest("POST", "/clients", strings.NewReader(string(jsonValue)))
    req.Header.Set("Content-Type", "application/json")
    w := httptest.NewRecorder()
    router.ServeHTTP(w, req)

    assert.Equal(t, http.StatusOK, w.Code)

    var response map[string]interface{}
    json.Unmarshal(w.Body.Bytes(), &response)
    assert.NotEmpty(t, response["id"])
}
