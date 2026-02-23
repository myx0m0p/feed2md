export const sampleRss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:content="http://purl.org/rss/1.0/modules/content/">
  <channel>
    <title>Example RSS Feed</title>
    <link>https://example.com</link>
    <item>
      <title>Article 1</title>
      <link>https://example.com/article-1</link>
      <pubDate>Mon, 10 Feb 2025 10:00:00 GMT</pubDate>
      <description>First article summary.</description>
    </item>
    <item>
      <title>Article 2</title>
      <link>https://example.com/article-2</link>
      <pubDate>Tue, 11 Feb 2025 10:00:00 GMT</pubDate>
      <content:encoded><![CDATA[<p>Second <strong>article</strong> preview from content:encoded.</p>]]></content:encoded>
    </item>
  </channel>
</rss>`

export const sampleAtom = `<?xml version="1.0" encoding="utf-8"?>
<feed xmlns="http://www.w3.org/2005/Atom">
  <title>Example Atom Feed</title>
  <link href="https://example.org" rel="alternate"/>
  <updated>2025-02-10T10:00:00Z</updated>
  <entry>
    <title>Atom Entry 1</title>
    <link href="https://example.org/entry-1" rel="alternate"/>
    <updated>2025-02-10T10:00:00Z</updated>
    <summary>Atom summary 1.</summary>
  </entry>
  <entry>
    <title>Atom Entry 2</title>
    <link href="https://example.org/entry-2" rel="alternate"/>
    <updated>2025-02-11T10:00:00Z</updated>
    <content type="html"><![CDATA[<p>Atom content preview 2.</p>]]></content>
  </entry>
</feed>`
