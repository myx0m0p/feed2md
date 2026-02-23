# feed2md Samples

Samples below are sourced from `test/fixtures.ts` so they include richer feed/item metadata.

## 1) RSS fixture (`nytTechnologyRss`) -> short template

### Input

```xml
<?xml version="1.0" encoding="UTF-8"?>
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
</rss>
```

### Command

```bash
feed2md https://rss.nytimes.com/services/xml/rss/nyt/Technology.xml --template short
```

### Output

```md
# NYT \> Technology

Source: https://www.nytimes.com/section/technology

## Articles

- People Loved the Dot\-Com Boom\. The A\.I\. Boom, Not So Much\. - (https://www.nytimes.com/2026/02/21/technology/ai-boom-backlash.html)
  - Published: Sat, 21 Feb 2026 10:00:09 \+0000
  - Summary: Tech leaders are beginning to worry about the public’s underwhelming enthusiasm for their plans to remake the world with artificial intelligence\.
```

## 2) RSS fixture (`nytTechnologyRss`) -> long template (`--template full`)

### Command

```bash
feed2md https://rss.nytimes.com/services/xml/rss/nyt/Technology.xml --template full
```

### Output

```md
# NYT \> Technology

Source: https://www.nytimes.com/section/technology

Description: New York Times technology coverage\.
Language: en\-us
Published: Mon, 23 Feb 2026 04:01:27 \+0000
Updated: Mon, 23 Feb 2026 06:26:58 \+0000
Copyright: Copyright 2026 The New York Times Company
Image: https://static01.nyt.com/images/misc/NYT_logo_rss_250x40.png
Links: self, application/rss+xml: https://rss.nytimes.com/services/xml/rss/nyt/Technology.xml

## Articles

- People Loved the Dot\-Com Boom\. The A\.I\. Boom, Not So Much\. - (https://www.nytimes.com/2026/02/21/technology/ai-boom-backlash.html)
  - Published: Sat, 21 Feb 2026 10:00:09 \+0000
  - ID: https://www\.nytimes\.com/2026/02/21/technology/ai\-boom\-backlash\.html
  - Author: David Streitfeld
  - Categories: Artificial Intelligence, Computers and the Internet
  - Media: https://static01\.nyt\.com/images/2026/02/22/multimedia/21biz\-ai\-backlash\-altman\-ckvl/21biz\-ai\-backlash\-altman\-ckvl\-mediumSquareAt3X\.jpg \| image, 1230x1230 \| credit: Associated Press \| description: Sam Altman recently said artificial intelligence was spreading more slowly than expected\.
  - Summary: Tech leaders are beginning to worry about the public’s underwhelming enthusiasm for their plans to remake the world with artificial intelligence\.
```

## 3) Atom fixture (`richAtomFeed`) -> short template

### Input

```xml
<?xml version="1.0" encoding="utf-8"?>
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
</feed>
```

### Command

```bash
feed2md https://www.theverge.com/rss/index.xml --template short
```

### Output

```md
# The Verge

Source: https://www.theverge.com

## Articles

- Sample Verge Story - (https://www.theverge.com/2026/2/22/sample-story)
  - Published: 2026\-02\-21T23:55:00\+00:00
  - Summary: A sample Atom summary\.
```

## 4) Atom fixture (`richAtomFeed`) -> long template (`--template full`)

### Command

```bash
feed2md https://www.theverge.com/rss/index.xml --template full
```

### Output

```md
# The Verge

Source: https://www.theverge.com

Description: The Verge feed subtitle
Language: en
Updated: 2026\-02\-22T00:23:00\+00:00
ID: https://www\.theverge\.com/rss/index\.xml
Image: https://cdn.vox-cdn.com/thumbor/verge-icon.png
Links: self, application/atom+xml: https://www.theverge.com/rss/index.xml

## Articles

- Sample Verge Story - (https://www.theverge.com/2026/2/22/sample-story)
  - Published: 2026\-02\-21T23:55:00\+00:00
  - Updated: 2026\-02\-22T00:23:00\+00:00
  - ID: tag:www\.theverge\.com,2026:/sample\-story
  - Author: The Verge Staff
  - Categories: Technology
  - Summary: A sample Atom summary\.
```
