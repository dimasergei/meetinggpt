'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  CheckCircle2, 
  Star, 
  Users, 
  Zap, 
  Shield, 
  Clock, 
  Headphones, 
  FileText, 
  Globe, 
  Video, 
  Calendar,
  ArrowRight,
  Sparkles,
  Crown,
  Rocket
} from 'lucide-react'
import { cn } from '@/lib/utils'

interface PricingPlan {
  id: string
  name: string
  description: string
  price: string
  priceDescription: string
  features: string[]
  highlighted: boolean
  icon: React.ReactNode
  popular?: boolean
  cta: string
}

const PRICING_PLANS: PricingPlan[] = [
  {
    id: 'free',
    name: 'Starter',
    description: 'Perfect for individuals and small teams',
    price: '$0',
    priceDescription: 'Free forever',
    features: [
      '5 hours of transcription per month',
      'Basic meeting summaries',
      'Standard audio quality',
      'Email support',
      'Mobile app access'
    ],
    highlighted: false,
    icon: <Users className="w-6 h-6" />,
    cta: 'Get Started'
  },
  {
    id: 'pro',
    name: 'Professional',
    description: 'Ideal for growing teams and professionals',
    price: '$29',
    priceDescription: 'per user/month',
    features: [
      '50 hours of transcription per month',
      'Advanced AI summaries',
      'High-quality audio processing',
      'Real-time collaboration',
      'Priority email support',
      'Custom vocabulary',
      'Meeting insights and analytics',
      'API access'
    ],
    highlighted: true,
    icon: <Zap className="w-6 h-6" />,
    popular: true,
    cta: 'Start Free Trial'
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    description: 'For large organizations with advanced needs',
    price: 'Custom',
    priceDescription: 'Contact us for pricing',
    features: [
      'Unlimited transcription hours',
      'Enterprise-grade security',
      'Custom AI models',
      'Advanced analytics dashboard',
      'SSO and SAML integration',
      'Dedicated account manager',
      'Custom training data',
      'White-label options',
      '99.9% uptime SLA',
      'On-premise deployment'
    ],
    highlighted: false,
    icon: <Crown className="w-6 h-6" />,
    cta: 'Contact Sales'
  }
]

const TESTIMONIALS = [
  {
    id: '1',
    name: 'Sarah Chen',
    role: 'Product Manager',
    company: 'TechCorp',
    avatar: 'SC',
    content: 'MeetingGPT has transformed how we handle meetings. The AI summaries are incredibly accurate, and we save hours every week on manual note-taking.',
    rating: 5
  },
  {
    id: '2',
    name: 'Michael Rodriguez',
    role: 'CEO',
    company: 'StartupXYZ',
    avatar: 'MR',
    content: 'The real-time transcription and AI insights have revolutionized our decision-making process. We can now focus on the conversation instead of taking notes.',
    rating: 5
  },
  {
    id: '3',
    name: 'Emily Watson',
    role: 'Operations Director',
    company: 'GlobalCorp',
    avatar: 'EW',
    content: 'The collaboration features and action item tracking have improved our team productivity by 40%. MeetingGPT is now essential to our workflow.',
    rating: 5
  },
  {
    id: '4',
    name: 'David Kim',
    role: 'Engineering Lead',
    company: 'DevStudio',
    avatar: 'DK',
    content: 'The API integration and custom vocabulary features make MeetingGPT perfect for our technical meetings. The accuracy is outstanding.',
    rating: 5
  }
]

export function PricingPage() {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly')
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null)

  const handlePlanSelect = (planId: string) => {
    setSelectedPlan(planId)
  }

  const getPlanButtonVariant = (planId: string, highlighted: boolean) => {
    if (selectedPlan === planId) return 'default'
    if (highlighted) return 'default'
    return 'outline'
  }

  const getPlanButtonClass = (planId: string, highlighted: boolean) => {
    if (selectedPlan === planId) {
      return 'bg-gradient-to-r from-primary to-accent text-white border-0 hover:opacity-90'
    }
    if (highlighted) {
      return 'bg-gradient-to-r from-primary to-accent text-white border-0 hover:opacity-90'
    }
    return 'border-border hover:bg-muted/50'
  }

  return (
    <div className="space-y-16">
      {/* Header */}
      <div className="text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Badge className="mb-4 bg-primary/15 text-primary-foreground border-primary/20">
            <Sparkles className="w-4 h-4 mr-2" />
            Pricing Plans
          </Badge>
          <h2 className="text-3xl font-bold mb-4 text-gradient">
            Choose Your Perfect Plan
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Start free and scale as your team grows. All plans include our core AI-powered features.
          </p>
        </motion.div>

        {/* Billing Toggle */}
        <div className="flex items-center justify-center space-x-4 mb-8">
          <span className={cn(
            "text-sm font-medium",
            billingCycle === 'monthly' ? 'text-foreground' : 'text-muted-foreground'
          )}>
            Monthly
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setBillingCycle(billingCycle === 'monthly' ? 'yearly' : 'monthly')}
            className="relative"
          >
            <div className={cn(
              "absolute inset-0 bg-gradient-to-r from-primary to-accent rounded-md transition-opacity duration-300",
              billingCycle === 'yearly' ? 'opacity-100' : 'opacity-0'
            )} />
            <span className="relative z-10">Annual</span>
          </Button>
          {billingCycle === 'yearly' && (
            <Badge className="bg-green-500/15 text-green-200 border-green-500/30">
              Save 20%
            </Badge>
          )}
        </div>
      </div>

      {/* Pricing Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {PRICING_PLANS.map((plan, index) => (
          <motion.div
            key={plan.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
          >
            <Card className={cn(
              "relative h-full",
              plan.highlighted && "border-2 border-primary shadow-glow"
            )}>
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <Badge className="bg-gradient-to-r from-primary to-accent text-white border-0">
                    Most Popular
                  </Badge>
                </div>
              )}
              
              <CardHeader className="text-center pb-4">
                <div className="flex justify-center mb-4">
                  <div className={cn(
                    "w-12 h-12 rounded-lg flex items-center justify-center",
                    plan.highlighted 
                      ? "bg-gradient-to-br from-primary/20 to-accent/20" 
                      : "bg-muted/20"
                  )}>
                    {plan.icon}
                  </div>
                </div>
                
                <CardTitle className="text-xl font-bold">{plan.name}</CardTitle>
                <p className="text-sm text-muted-foreground mb-4">{plan.description}</p>
                
                <div className="text-center mb-6">
                  <div className="text-3xl font-bold text-gradient">
                    {plan.price}
                  </div>
                  <div className="text-sm text-muted-foreground">{plan.priceDescription}</div>
                </div>
              </CardHeader>
              
              <CardContent className="pt-0">
                <ul className="space-y-3">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-start space-x-3">
                      <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                      <span className="text-sm text-foreground">{feature}</span>
                    </li>
                  ))}
                </ul>
                
                <div className="mt-8">
                  <Button
                    className={cn(
                      "w-full",
                      getPlanButtonClass(plan.id, plan.highlighted)
                    )}
                    variant={getPlanButtonVariant(plan.id, plan.highlighted)}
                    onClick={() => handlePlanSelect(plan.id)}
                  >
                    {plan.cta}
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Testimonials */}
      <div className="mt-20">
        <div className="text-center mb-12">
          <h3 className="text-2xl font-bold mb-4 text-gradient">
            Trusted by Teams Worldwide
          </h3>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            See what our customers have to say about MeetingGPT
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {TESTIMONIALS.map((testimonial, index) => (
            <motion.div
              key={testimonial.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card className="surface-glass h-full">
                <CardContent className="p-6">
                  <div className="flex items-center space-x-4 mb-4">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center text-primary font-bold">
                      {testimonial.avatar}
                    </div>
                    <div>
                      <div className="font-semibold">{testimonial.name}</div>
                      <div className="text-sm text-muted-foreground">
                        {testimonial.role} at {testimonial.company}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-1 mb-4">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className={cn(
                          "w-4 h-4",
                          i < testimonial.rating ? "text-yellow-400 fill-current" : "text-muted-foreground"
                        )}
                      />
                    ))}
                  </div>
                  
                  <p className="text-sm text-foreground italic">
                    "{testimonial.content}"
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>

      {/* FAQ Section */}
      <div className="mt-20">
        <div className="text-center mb-12">
          <h3 className="text-2xl font-bold mb-4 text-gradient">
            Frequently Asked Questions
          </h3>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Got questions? We've got answers.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Card className="surface-glass">
            <CardHeader>
              <CardTitle className="text-lg">How accurate is the transcription?</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-foreground">
                Our AI transcription achieves 99.9% accuracy for clear audio. The accuracy may vary based on audio quality, accents, and background noise.
              </p>
            </CardContent>
          </Card>
          
          <Card className="surface-glass">
            <CardHeader>
              <CardTitle className="text-lg">Can I cancel anytime?</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-foreground">
                Yes, you can cancel your subscription at any time. No long-term commitments or cancellation fees.
              </p>
            </CardContent>
          </Card>
          
          <Card className="surface-glass">
            <CardHeader>
              <CardTitle className="text-lg">Is my data secure?</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-foreground">
                Absolutely. We use enterprise-grade encryption and are SOC2 compliant. Your data is never shared with third parties.
              </p>
            </CardContent>
          </Card>
          
          <Card className="surface-glass">
            <CardHeader>
              <CardTitle className="text-lg">Do you offer a free trial?</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-foreground">
                Yes! All plans start with a 14-day free trial. No credit card required to start.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* CTA Section */}
      <div className="text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Card className="surface-glass max-w-2xl mx-auto">
            <CardContent className="p-8">
              <Rocket className="w-12 h-12 text-primary mx-auto mb-4" />
              <h3 className="text-2xl font-bold mb-4 text-gradient">
                Ready to Transform Your Meetings?
              </h3>
              <p className="text-muted-foreground mb-6">
                Join thousands of teams already using MeetingGPT to make their meetings more productive.
              </p>
              <Button size="lg" className="bg-gradient-to-r from-primary to-accent text-white border-0 hover:opacity-90">
                Start Free Trial
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}
