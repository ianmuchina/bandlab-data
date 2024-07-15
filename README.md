# bandlab-data

Scrapes the Bandlab Sounds API

## Usage
- Login/Register to [bandlab.com](https://bandlab.com)
- Copy the `refresh_token` cookie
- Create a new json file at `data/token.json` with the value
```json
{ "refresh_token": "" }
```
- Install [deno](https://deno.com/)
- Run `deno task token:renew`

## Deno Tasks

```bash
# Check if token is valid and renew if invalid
deno task token

# Download all data from api (slow)
deno task data

# Renew Token
deno task token:renew

# Validate current access_token
deno task token:validate

# Print eta of `access_token`
deno task token:eta

# Download pack data
deno task data:packs

# Download sample data
deno task data:samples

# Download collection data
deno task data:collections

# Download example data. Used to generate types using
deno task data:tests

# Create/Update sqlite db at `data/bandlab-sounds.db`
deno task data:sqlite

# Validate token & renew if invalid
deno task token

# Download all data
deno task data
```

## API

- Host: `https://www.bandlab.com`
- Public: `/api/v3.0/sounds-public`
- Private: `/api/v3.0/sounds`

The public endpoint is read only and has fewer entries
The private endpoint requires an account and can do anything
