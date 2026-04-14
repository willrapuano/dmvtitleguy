import re
with open('src/components/BlogIndexClient.tsx', 'r') as f:
    data = f.read()

# Replace the conflict with the bottom version (FILTER_CARDS version) which seems more complete
data = re.sub(r'<<<<<<< HEAD.*?=======\n(.*?)\n>>>>>>> [^\n]+', r'\1', data, flags=re.DOTALL)

with open('src/components/BlogIndexClient.tsx', 'w') as f:
    f.write(data)
