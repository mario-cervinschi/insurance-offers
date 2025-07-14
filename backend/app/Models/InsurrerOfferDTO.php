<?php

namespace App\Models;

class InsurrerOfferDTO
{
    public string $businessName;
    public int $offerId;
    public string $providerOfferCode;
    public float $premiumAmount;
    public float $premiumAmountNet;
    public string $currency;
    public string $startDate;
    public string $endDate;
    public float $commissionValue;
    public float $commissionPercent;
    public string $bonusMalusClass;
    public ?string $greenCardExclusions;
    public ?string $offerExpiryDate;
    public ?string $pid;
    public ?array $installments;
    public bool $error;

    public function __construct(array $providerData, array $offer)
    {
        $this->error = false;
        $this->businessName = data_get($providerData, 'provider.organization.businessName');
        $this->offerId = $offer['offerId'];
        $this->providerOfferCode = $offer['providerOfferCode'];
        $this->premiumAmount = $offer['premiumAmount'];
        $this->premiumAmountNet = $offer['premiumAmountNet'];
        $this->currency = $offer['currency'];
        $this->startDate = $offer['startDate'];
        $this->endDate = $offer['endDate'];
        $this->commissionValue = $offer['commissionValue'];
        $this->commissionPercent = $offer['commissionPercent'];
        $this->bonusMalusClass = $offer['bonusMalusClass'];
        $this->greenCardExclusions = $offer['greenCardExclusions'] ?? null;
        $this->offerExpiryDate = $offer['offerExpiryDate'] ?? null;
        $this->pid = $offer['pid'] ?? null;
        $this->installments = $offer['installments'] ?? [];
    }

    public function toArray(): array
    {
        return get_object_vars($this);
    }
}
