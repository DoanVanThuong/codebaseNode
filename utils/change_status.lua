local key = KEYS[1]
local newVal = ARGV[1]
local oldVal = ARGV[2]

local current = redis.call("GET", key)
if not current or current == oldVal then
    redis.call("SET", key, newVal)
    return 1
else
    return 0
end