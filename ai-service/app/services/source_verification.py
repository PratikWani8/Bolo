import urllib.parse

OFFICIAL_GOVT_DOMAINS = [
    'gov.in',
    'nic.in',
    'myscheme.gov.in',
    'services.india.gov.in',
    'india.gov.in',
    'digitalindia.gov.in',
    'pmkisan.gov.in',
    'nha.gov.in',
    'pmayg.nic.in',
    'pmuy.gov.in',
    'pmvishwakarma.gov.in',
    'indiapost.gov.in',
    'nsap.nic.in',
    'maharashtra.gov.in',
    'ladakibahin.maharashtra.gov.in',
]

def is_verified_government_url(url: str) -> bool:
    """Check if the URL belongs to an authentic Indian government domain."""
    if not url:
        return False
    try:
        parsed = urllib.parse.urlparse(url)
        hostname = (parsed.hostname or '').lower()
        if not hostname:
            return False
        return any(hostname == d or hostname.endswith('.' + d) for d in OFFICIAL_GOVT_DOMAINS)
    except Exception:
        return False

def verify_source_provenance(source: dict) -> dict:
    """Attach verification badges and checks to retrieved source records."""
    url = source.get('url', '')
    is_govt = is_verified_government_url(url)
    return {
        **source,
        'isVerifiedGovtDomain': is_govt,
        'verificationBadge': 'Verified Government Portal' if is_govt else 'Public Information Portal',
    }
