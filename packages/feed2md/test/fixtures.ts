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

export const nytTechnologyRss = `<?xml version="1.0" encoding="UTF-8"?>
<rss xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:media="http://search.yahoo.com/mrss/" xmlns:atom="http://www.w3.org/2005/Atom" version="2.0">
  <channel>
    <title>NYT &gt; Technology</title>
    <link>https://www.nytimes.com/section/technology</link>
    <atom:link href="https://rss.nytimes.com/services/xml/rss/nyt/Technology.xml" rel="self" type="application/rss+xml"></atom:link>
    <description>New York Times technology coverage.</description>
    <language>en-us</language>
    <copyright>Copyright 2026 The New York Times Company</copyright>
    <lastBuildDate>Mon, 23 Feb 2026 06:26:58 +0000</lastBuildDate>
    <pubDate>Mon, 23 Feb 2026 04:01:27 +0000</pubDate>
    <image>
      <title>NYT &gt; Technology</title>
      <url>https://static01.nyt.com/images/misc/NYT_logo_rss_250x40.png</url>
      <link>https://www.nytimes.com/section/technology</link>
    </image>
    <item>
      <title>People Loved the Dot-Com Boom. The A.I. Boom, Not So Much.</title>
      <link>https://www.nytimes.com/2026/02/21/technology/ai-boom-backlash.html</link>
      <guid isPermaLink="true">https://www.nytimes.com/2026/02/21/technology/ai-boom-backlash.html</guid>
      <atom:link href="https://www.nytimes.com/2026/02/21/technology/ai-boom-backlash.html" rel="standout"></atom:link>
      <description>Tech leaders are beginning to worry about the public’s underwhelming enthusiasm for their plans to remake the world with artificial intelligence.</description>
      <dc:creator>David Streitfeld</dc:creator>
      <pubDate>Sat, 21 Feb 2026 10:00:09 +0000</pubDate>
      <category domain="http://www.nytimes.com/namespaces/keywords/des">Artificial Intelligence</category>
      <category domain="http://www.nytimes.com/namespaces/keywords/des">Computers and the Internet</category>
      <media:content height="1230" medium="image" url="https://static01.nyt.com/images/2026/02/22/multimedia/21biz-ai-backlash-altman-ckvl/21biz-ai-backlash-altman-ckvl-mediumSquareAt3X.jpg" width="1230"></media:content>
      <media:credit>Associated Press</media:credit>
      <media:description>Sam Altman recently said artificial intelligence was spreading more slowly than expected.</media:description>
    </item>
  </channel>
</rss>`

export const cnnTopStoriesRss = `<?xml version="1.0" encoding="UTF-8"?>
<rss xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:content="http://purl.org/rss/1.0/modules/content/" xmlns:atom="http://www.w3.org/2005/Atom" version="2.0" xmlns:media="http://search.yahoo.com/mrss/">
  <channel>
    <title>CNN.com - RSS Channel - HP Hero</title>
    <description>CNN.com delivers up-to-the-minute news and information on the latest top stories.</description>
    <link>https://www.cnn.com/index.html</link>
    <generator>coredev-bumblebee</generator>
    <lastBuildDate>Thu, 22 Aug 2024 15:19:24 GMT</lastBuildDate>
    <pubDate>Tue, 18 Apr 2023 21:25:59 GMT</pubDate>
    <copyright>Copyright (c) 2024 Turner Broadcasting System, Inc. All Rights Reserved.</copyright>
    <language>en-US</language>
    <ttl>10</ttl>
    <item>
      <title>Some on-air claims about Dominion Voting Systems were false</title>
      <link>https://www.cnn.com/business/live-news/fox-news-dominion-trial-04-18-23/index.html</link>
      <guid isPermaLink="true">https://www.cnn.com/business/live-news/fox-news-dominion-trial-04-18-23/index.html</guid>
      <pubDate>Wed, 19 Apr 2023 12:44:51 GMT</pubDate>
      <media:group>
        <media:content medium="image" url="https://cdn.cnn.com/cnnnext/dam/assets/230418164538-02-dominion-fox-trial-settlement-0418-super-169.jpg" height="619" width="1100" type="image/jpeg"/>
        <media:content medium="image" url="https://cdn.cnn.com/cnnnext/dam/assets/230418164538-02-dominion-fox-trial-settlement-0418-large-11.jpg" height="300" width="300" type="image/jpeg"/>
      </media:group>
    </item>
  </channel>
</rss>`

export const richAtomFeed = `<?xml version="1.0" encoding="utf-8"?>
<feed xmlns="http://www.w3.org/2005/Atom" xml:lang="en">
  <title>The Verge</title>
  <subtitle>The Verge feed subtitle</subtitle>
  <updated>2026-02-22T00:23:00+00:00</updated>
  <link rel="alternate" type="text/html" href="https://www.theverge.com"/>
  <link rel="self" type="application/atom+xml" href="https://www.theverge.com/rss/index.xml"/>
  <id>https://www.theverge.com/rss/index.xml</id>
  <icon>https://cdn.vox-cdn.com/thumbor/verge-icon.png</icon>
  <entry>
    <author>
      <name>The Verge Staff</name>
      <email>newsroom@theverge.com</email>
    </author>
    <title>Sample Verge Story</title>
    <link rel="alternate" href="https://www.theverge.com/2026/2/22/sample-story"/>
    <id>tag:www.theverge.com,2026:/sample-story</id>
    <updated>2026-02-22T00:23:00+00:00</updated>
    <published>2026-02-21T23:55:00+00:00</published>
    <category term="Technology" scheme="https://www.theverge.com/rss/index.xml"/>
    <summary>A sample Atom summary.</summary>
    <content type="html"><![CDATA[<p>A sample Atom content block.</p>]]></content>
  </entry>
</feed>`
