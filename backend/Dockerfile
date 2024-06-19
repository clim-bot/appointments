# Dockerfile for backend
FROM golang:1.22.3-alpine AS build

# Install necessary build dependencies
RUN apk add --no-cache gcc g++ make libc-dev

WORKDIR /app

# Copy the Go Modules manifests
COPY go.mod go.sum ./
RUN go mod download

# Copy the source code
COPY . .

# Build the application
RUN go build -o main .

# Final stage
FROM alpine:latest

WORKDIR /root/

# Copy the built binary from the build stage
COPY --from=build /app/main .

# Copy the SQLite database file
COPY ./schedule.db /root/data/schedule.db

# Copy the .env
COPY --from=build /app/.env .


# Expose port
EXPOSE 8080

# Command to run the executable
CMD ["./main"]
