import { useValues } from 'kea'
import { TaxonomicFilter } from 'lib/components/TaxonomicFilter/TaxonomicFilter'
import { TaxonomicFilterGroupType, TaxonomicFilterLogicProps } from 'lib/components/TaxonomicFilter/types'
import { LemonButton } from 'lib/lemon-ui/LemonButton'
import { Popover } from 'lib/lemon-ui/Popover'
import { useState } from 'react'
import { featureFlagLogic } from 'scenes/feature-flags/featureFlagLogic'

interface FlagSelectorProps {
    value: number | undefined
    onChange: (id: number, key: string) => void
    readOnly?: boolean
}

export function FlagSelector({ value, onChange, readOnly }: FlagSelectorProps): JSX.Element {
    const [visible, setVisible] = useState(false)

    const { featureFlag } = useValues(featureFlagLogic({ id: value || 'link' }))

    const taxonomicFilterLogicProps: TaxonomicFilterLogicProps = {
        groupType: TaxonomicFilterGroupType.FeatureFlags,
        value: value,
        onChange: (_, __, item) => {
            'id' in item && item.id && onChange(item.id, item.key)
            setVisible(false)
        },
        taxonomicGroupTypes: [TaxonomicFilterGroupType.FeatureFlags],
        optionsFromProp: undefined,
        popoverEnabled: true,
        selectFirstItem: true,
        taxonomicFilterLogicKey: 'flag-selectorz',
    }

    return (
        <Popover
            overlay={<TaxonomicFilter {...taxonomicFilterLogicProps} />}
            visible={visible}
            placement="right-start"
            fallbackPlacements={['left-end', 'bottom']}
            onClickOutside={() => setVisible(false)}
        >
            {readOnly ? (
                <div>{featureFlag.key}</div>
            ) : (
                <LemonButton
                    data-attr={'session-recording-config-linked-flag-selector'}
                    type="secondary"
                    onClick={() => setVisible(!visible)}
                >
                    {featureFlag.key ? featureFlag.key : 'Select flag'}
                </LemonButton>
            )}
        </Popover>
    )
}
