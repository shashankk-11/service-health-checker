# Use Bun runtime
FROM oven/bun:1

WORKDIR /app

# Install deps
COPY package.json bun.lockb ./
RUN bun install

# Copy source
COPY . .

# Expose app port
EXPOSE 3000

# Start app
CMD ["bun", "src/index.ts"]