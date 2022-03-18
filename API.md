# API documentation
Short links can be generated in a programmable way by calling the API interface.

This is a public API, which mean that there is no need of a private key. Anyone can use it to integrate it to their program.

### API call address
POST https://shrtnr.tk

### Calling method: HTTP POST Request format: JSON
Example:
````json
{
	"url": "https://example.com/verylongurl"
}
````

### Request parameters:
|Parameter name|Type|Description|Required|Example|
| :----:| :----: | :----: | :----: | :----: |
| url | string | URL (must include http:// or https://) | ✅ | https://example.com/verylongurl |

### Example response (JSON)
```json
{
	"status": 200,
	"key": "2MKGS3",
	"url": "https://example.com/verylongurl",
	"shortUrl": "https://shrtnr.tk/2MKGS3"
}
```

### Response parameters
| Parameter name | Type | Description | Example |
| :----:| :----: | :----: | :----: |
| status | int | Status code: 200 is a successful call, 500 is not | 200 |
| key | string | The unique key | 2MKGS3 |
| url | string | Confirmation of the shortened URL | https://example.com/verylongurl |
| shortUrl | string | The new short URL | https://shrtnr.tk/2MKGS3 |